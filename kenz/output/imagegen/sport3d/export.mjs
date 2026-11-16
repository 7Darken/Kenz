import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Conversion, framing and review sheets only. All illustrations are image_gen outputs.
const root = path.resolve(import.meta.dirname, '../../..');
const out = path.join(root, 'maquettes/v6/assets/sport3d');
const manifest = JSON.parse(await fs.readFile(path.join(out, 'manifest.json'), 'utf8'));
const sources = JSON.parse(await fs.readFile(new URL('sources.json', import.meta.url), 'utf8'));
const byId = new Map(sources.map(source => [source.id, source.path]));
await fs.mkdir(path.join(out, '256'), {recursive:true});
await fs.mkdir(path.join(out, 'planches'), {recursive:true});
const checks = [];

function bounds(data, width, height) {
  let left = width, right = -1, top = height, bottom = -1, transparent = 0, partial = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const alpha = data[(y * width + x) * 4 + 3];
    if (!alpha) { transparent++; continue; }
    if (alpha < 255) partial++;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  if (right < 0) throw new Error('Empty alpha');
  return {left, top, width:right-left+1, height:bottom-top+1, transparent, partial};
}

for (const asset of manifest.assets) {
  const source = byId.get(asset.id);
  if (!source) throw new Error(`Missing source: ${asset.id}`);
  const meta = await sharp(source).metadata();
  if (!meta.hasAlpha) throw new Error(`Missing alpha: ${asset.id}`);
  const {data, info} = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const b = bounds(data, info.width, info.height);
  if (b.transparent < info.width * info.height * .1) throw new Error(`Background is not transparent: ${asset.id}`);
  const object = await sharp(source)
    .extract({left:b.left, top:b.top, width:b.width, height:b.height})
    .resize({width:819, height:717, fit:'inside'})
    .png().toBuffer();
  const master = await sharp(object)
    .resize({width:1024, height:1024, fit:'contain', background:{r:0,g:0,b:0,alpha:0}, withoutEnlargement:true})
    .webp({lossless:true, effort:6}).toBuffer();
  await fs.writeFile(path.join(out, asset.master), master);
  await sharp(master).resize(256,256).webp({quality:90, alphaQuality:100, effort:6})
    .toFile(path.join(out, asset.small));
  // The same exact prompt accompanies each resolution.
  await fs.copyFile(path.join(out, asset.prompt), path.join(out, '256', asset.prompt));
  const entry = {id:asset.id, source:{width:meta.width,height:meta.height}, exports:[]};
  for (const [file, size] of [[asset.master,1024],[asset.small,256]]) {
    const filename = path.join(out,file);
    const m = await sharp(filename).metadata();
    const {data:rgba,info:ri} = await sharp(filename).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const area = bounds(rgba,ri.width,ri.height);
    const clearEdges = area.left > 0 && area.top > 0 && area.left+area.width < size && area.top+area.height < size;
    if (m.format !== 'webp' || m.width !== size || m.height !== size || !m.hasAlpha || !clearEdges)
      throw new Error(`Invalid export: ${file}`);
    entry.exports.push({file,width:size,height:size,bytes:(await fs.stat(filename)).size,hasAlpha:true,transparentBorder:true,visibleBounds:area});
  }
  checks.push(entry);
}

const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for (const [theme,bg,fg,muted] of [['sombre','#0D0F0E','#F7F7F2','#8F9B94'],['clair','#F4F6F2','#1A1D1C','#58665D']]) {
  for (const size of [40,160]) {
    const cols=6, cellW=204, cellH=size+70, width=cols*cellW+48, height=Math.ceil(manifest.assets.length/cols)*cellH+112;
    let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}"/><g font-family="Arial, sans-serif"><text x="32" y="38" fill="${fg}" font-size="24" font-weight="bold">k15ze · Sport 3D</text><text x="32" y="64" fill="${muted}" font-size="13">18 icônes · ${size} px · fond ${bg} · WebP alpha</text>`;
    const layers=[];
    for (const [i,a] of manifest.assets.entries()) {
      const x=24+(i%cols)*cellW, y=90+Math.floor(i/cols)*cellH;
      svg+=`<text x="${x+cellW/2}" y="${y+size+22}" text-anchor="middle" fill="${fg}" font-size="12">${escape(a.label)}</text><text x="${x+cellW/2}" y="${y+size+40}" text-anchor="middle" fill="${muted}" font-size="10">${a.series}</text>`;
      layers.push({input:await sharp(path.join(out,a.small)).resize(size,size).png().toBuffer(),left:x+(cellW-size)/2,top:y});
    }
    svg+='</g></svg>';
    await sharp(Buffer.from(svg)).composite(layers).webp({lossless:true,effort:6}).toFile(path.join(out,'planches',`${theme}-${size}.webp`));
  }
}

const cards=manifest.assets.map(a=>`<article class="card"><div class="samples"><div class="sample dark"><img src="${a.small}" alt="${escape(a.label)}" width="160" height="160"><img class="tiny" src="${a.small}" alt="" width="40" height="40"></div><div class="sample light"><img src="${a.small}" alt="" width="160" height="160"><img class="tiny" src="${a.small}" alt="" width="40" height="40"></div></div><div class="caption"><span>${a.series}</span><h2>${escape(a.label)}</h2><nav aria-label="Fichiers ${escape(a.label)}"><a href="${a.master}" download>1024 px</a><a href="${a.small}" download>256 px</a><a href="${a.prompt}">Prompt</a></nav></div></article>`).join('\n');
await fs.writeFile(path.join(out,'index.html'),`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>k15ze · Sport 3D</title><style>
*{box-sizing:border-box}body{margin:0;background:#101311;color:#f7f7f2;font:14px/1.6 system-ui,sans-serif}main{max-width:1400px;margin:auto;padding:48px 24px}header{margin-bottom:32px}h1{font-size:clamp(28px,4vw,48px);margin:4px 0;letter-spacing:-.04em}p{color:#a5b1a9;margin:8px 0}.eyebrow{color:#3ddc84;letter-spacing:.16em;font-size:12px}a{color:inherit;text-underline-offset:4px}a:hover{color:#3ddc84}a:focus-visible{outline:2px solid #3ddc84;outline-offset:4px}header nav{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:20px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:20px}.card{overflow:hidden;border:1px solid #2a332d;border-radius:18px}.samples{display:grid;grid-template-columns:1fr 1fr}.sample{min-width:0;display:flex;flex-direction:column;align-items:center;padding:12px 0 20px;gap:4px}.dark{background:#0d0f0e}.light{background:#f4f6f2}img{object-fit:contain;max-width:100%;height:auto}.tiny{width:40px;height:40px}.caption{padding:18px 20px 20px}.caption span{font-size:10px;letter-spacing:.16em;color:#92a198}h2{margin:4px 0 12px;font-size:18px;font-weight:600}.caption nav{display:flex;gap:20px;font-size:12px}
</style></head><body><main><header><div class="eyebrow">K15ZE / COLLECTION SPORT</div><h1>18 objets. Une même signature.</h1><p>HYROX, Spartan et boxe. Chaque icône est présentée à 160 et 40 px, sur fond sombre et clair.</p><p>Masters WebP 1024 px sans perte · copies WebP 256 px · fond transparent · prompts exacts.</p><nav aria-label="Planches de contrôle"><a href="planches/sombre-160.webp">Sombre · 160 px</a><a href="planches/clair-160.webp">Clair · 160 px</a><a href="planches/sombre-40.webp">Sombre · 40 px</a><a href="planches/clair-40.webp">Clair · 40 px</a></nav></header><section class="grid" aria-label="Les 18 icônes">${cards}</section></main></body></html>`);

const total=checks.reduce((sum,c)=>sum+c.exports.reduce((s,e)=>s+e.bytes,0),0);
await fs.writeFile(path.join(out,'validation.json'),JSON.stringify({date:'2026-11-15',assetCount:checks.length,exportCount:checks.length*2,totalBytes:total,checks},null,2)+'\n');
console.log(JSON.stringify({assets:checks.length,exports:checks.length*2,totalBytes:total,preview:path.join(out,'index.html')},null,2));
