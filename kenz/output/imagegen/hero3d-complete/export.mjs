import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../../..');
const out = path.join(root, 'maquettes/v6/assets/hero3d');
const manifest = JSON.parse(await fs.readFile(new URL('manifest.json',import.meta.url),'utf8'));
const report = [];
const previous = JSON.parse(await fs.readFile(new URL('previous-validation.json',import.meta.url),'utf8'));

await fs.mkdir(path.join(out,'planches'),{recursive:true});

for (const a of manifest.assets) {
  const dir = path.join(out,a.series);
  await fs.mkdir(path.join(dir,'512'),{recursive:true});
  const metadata = await sharp(a.source).metadata();
  if (!metadata.hasAlpha) throw new Error('Source must have alpha: '+a.id);
  const {data,info} = await sharp(a.source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let l=info.width,t=info.height,r=-1,b=-1,transparent=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const alpha=data[(y*info.width+x)*4+3];
    if(alpha===0)transparent++;
    // Ignore almost invisible stray pixels when measuring the object for framing.
    // Keep the generated pixel alpha unchanged in the crop.
    if(alpha<=8)continue;
    l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);
  }
  if(r<0||transparent<info.width*info.height*.1)throw new Error('Invalid cutout: '+a.id);
  l=Math.max(0,l-4);t=Math.max(0,t-4);r=Math.min(info.width-1,r+4);b=Math.min(info.height-1,b+4);
  const object=await sharp(a.source).extract({left:l,top:t,width:r-l+1,height:b-t+1})
    .resize({width:696,height:696,fit:'inside'}).png().toBuffer();
  const master=await sharp(object).resize({width:1024,height:1024,fit:'contain',withoutEnlargement:true,background:{r:0,g:0,b:0,alpha:0}})
    .png().toBuffer();
  const exports=[];
  for(const size of [1024,512]){
    const target=size===1024?dir:path.join(dir,'512');
    const png=path.join(target,a.id+'.png'),webp=path.join(target,a.id+'.webp');
    await sharp(master).resize(size,size).png({compressionLevel:9}).toFile(png);
    await sharp(master).resize(size,size).webp(size===1024?{lossless:true,effort:6}:{quality:94,alphaQuality:100,effort:6}).toFile(webp);
    for(const file of [png,webp]){
      const m=await sharp(file).metadata();
      if(m.width!==size||m.height!==size||!m.hasAlpha)throw new Error('Invalid export '+file);
      exports.push({file:path.relative(out,file),width:size,height:size,hasAlpha:true,bytes:(await fs.stat(file)).size});
    }
  }
  await fs.copyFile(path.join(dir,a.id+'.txt'),path.join(dir,'512',a.id+'.txt'));
  const bg=await sharp(path.join(root,a.background)).resize(1120,630,{fit:'cover'}).png().toBuffer();
  await sharp(bg).composite([
    {input:await sharp(master).resize(400,400).png().toBuffer(),left:180,top:132},
    {input:await sharp(master).resize(80,80).png().toBuffer(),left:800,top:276},
  ]).webp({quality:94,effort:6}).toFile(path.join(out,'planches',a.id+'-hero.webp'));
  report.push({id:a.id,exports});
}
await fs.writeFile(path.join(out,'validation.json'),JSON.stringify({status:'delivered',pilotApproved:true,revision:5,generator:'built-in image_gen',assets:[...previous.assets.filter(a=>!report.some(r=>r.id===a.id)),...report]},null,2)+'\n');
console.log(JSON.stringify(report,null,2));

