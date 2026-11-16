import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'../../..');
const out=path.join(root,'maquettes/v6/assets/hero3d');
const objects=[
  ['pro-telephone','Téléphone','pro'],['pro-noyau-ia','Agents IA','pro'],
  ['pro-trophee','Trophée','pro'],['pro-satellite','Satellite','pro'],
  ['createur-passeport','Passeport','createur'],['createur-avion','Avion','createur'],
  ['createur-appareil','Appareil photo','createur'],['createur-etiquette','Étiquette de bagage','createur']
].map(([id,label,series])=>({id,label,series,master:`${series}/${id}.webp`,small:`${series}/512/${id}.webp`,png:`${series}/${id}.png`,prompt:`${series}/${id}.txt`}));
const manifest={generator:'built-in image_gen',status:'delivered',style:'HYROX miniature matte',masterSize:1024,copySize:512,format:'webp',pngAlsoIncluded:true,neon:{bakedIntoImages:false,css:'neon.css',inlineSvg:'neon-filter.svg',defaultStrength:.4},assets:objects};
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');

for(const series of ['pro','createur']){
  const subset=objects.filter(a=>a.series===series);
  const background=path.join(root,'output/hero-horizon-valide',series==='pro'?'01-horizon-pro.png':'02-horizon-createur.png');
  const base=await sharp(background).resize(1600,900).png().toBuffer();
  const layers=[];
  for(const [i,a] of subset.entries()){
    layers.push({input:await sharp(path.join(out,a.master)).resize(400,400).png().toBuffer(),left:i*400,top:140});
    layers.push({input:await sharp(path.join(out,a.small)).resize(80,80).png().toBuffer(),left:i*400+160,top:660});
  }
  await sharp(base).composite(layers).webp({quality:94,effort:6}).toFile(path.join(out,'planches',series+'-400-80.webp'));
}

const filter=await fs.readFile(path.join(out,'neon-filter.svg'),'utf8');
function picture(a,tiny=false){
  return `<span class="hero3d-neon${tiny?' miniature':''}"><img class="base" src="${a.small}" width="512" height="512" alt="${tiny?'':a.label}" decoding="async"><img class="hero3d-neon__glow" src="${a.small}" width="512" height="512" alt="" aria-hidden="true" decoding="async"></span>`;
}
const cards=objects.map(a=>`<article class="card" data-series="${a.series}" data-id="${a.id}"><div class="stage">${picture(a)}</div><div class="caption"><div><span class="series">${a.series==='pro'?'PRO':'CRÉATEUR'}</span><h2>${a.label}</h2><nav aria-label="Fichiers ${a.label}"><a download href="${a.master}">WebP 1024</a><a download href="${a.small}">WebP 512</a><a href="${a.prompt}">Prompt</a></nav></div><div class="small-sample">${picture(a,true)}<span>80 px</span></div></div></article>`).join('\n');
await fs.writeFile(path.join(out,'index.html'),`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>k15ze · Objets des heros</title><link rel="stylesheet" href="neon.css"><style>
*{box-sizing:border-box}body{margin:0;background:#0d0f0e;color:#f7f7f2;font:14px/1.5 system-ui,sans-serif;--demo-intensity:.4}main{max-width:1600px;margin:auto;padding:40px 24px 60px}header{margin-bottom:24px}.eyebrow{color:#6cd3e0;font-size:12px;letter-spacing:.16em}h1{font-size:clamp(28px,3.7vw,48px);letter-spacing:-.04em;margin:8px 0}header p{color:#a5b3b0;margin:8px 0}a{color:inherit;text-underline-offset:4px}a:hover{color:#75dbe8}a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #75dbe8;outline-offset:4px}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:12px 24px;padding:16px 20px;margin:24px 0;border:1px solid #293330;border-radius:14px;background:#171d1b}.controls label{display:flex;align-items:center;gap:8px;white-space:nowrap}input{accent-color:#60cbdc}input[type=range]{width:120px}select{font:inherit;color:inherit;background:#202a26;border:1px solid #42534b;border-radius:7px;padding:5px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.card{border:1px solid #293330;border-radius:18px;overflow:hidden;background:#141a17}.stage{background:#0d0f0e}.caption{padding:14px 16px 18px;display:flex;align-items:center;justify-content:space-between;gap:4px}.series{font-size:10px;letter-spacing:.14em;color:#8fa69d}h2{font-size:17px;margin:4px 0 12px}.caption nav{display:flex;gap:10px;flex-wrap:wrap;font-size:11px}.small-sample{width:80px;flex-shrink:0;text-align:center;font-size:10px;color:#8fa69d}.miniature{width:80px;height:80px}.hero3d-neon{--neon-strength:var(--demo-intensity)}body.neon-off .hero3d-neon{--neon-strength:0}body.light .stage{background:#f4f6f2}body.heroes [data-series=pro] .stage{background:center/cover url('../img/horizon-pro.jpg')}body.heroes [data-series=createur] .stage{background:center/cover url('../img/horizon-createur.jpg')}.boards{display:flex;gap:20px;flex-wrap:wrap;margin-top:28px;color:#aec2b9;font-size:12px}@media(max-width:1150px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){main{padding:24px 16px}.grid{grid-template-columns:1fr}.controls{gap:12px}}
</style></head><body>${filter}<main><header><div class="eyebrow">K15ZE / PRO + CRÉATEUR</div><h1>Les objets des heros.</h1><p>8 miniatures · WebP transparents en 1024 et 512 px · prompts exacts.</p><p>Le néon ci-dessous éclaire les accents Lagon. Son intensité et son animation restent réglables.</p></header><form class="controls" onsubmit="return false"><label><input id="neon" type="checkbox" checked> Néon</label><label>Intensité <input id="strength" type="range" min="0" max="1" step="0.05" value="0.4"><output id="strength-value">40 %</output></label><label><input id="pulse" type="checkbox"> Pulsation douce</label><label>Fond <select id="background"><option value="">Sombre</option><option value="light">Clair</option><option value="heroes">Heros</option></select></label></form><section class="grid" aria-label="Collection des huit objets">${cards}</section><nav class="boards" aria-label="Planches"><a href="planches/pro-400-80.webp">Planche Pro · 400 et 80 px</a><a href="planches/createur-400-80.webp">Planche Créateur · 400 et 80 px</a><a href="neon.css">CSS néon</a><a href="neon-filter.svg">Filtre SVG à intégrer</a><a href="manifest.json">Manifeste</a></nav></main><script>
document.querySelector('#neon').addEventListener('change',e=>document.body.classList.toggle('neon-off',!e.target.checked));
document.querySelector('#strength').addEventListener('input',e=>{document.body.style.setProperty('--demo-intensity',e.target.value);document.querySelector('#strength-value').value=Math.round(Number(e.target.value)*100)+' %';});
document.querySelector('#pulse').addEventListener('change',e=>document.querySelectorAll('.hero3d-neon').forEach(el=>el.classList.toggle('hero3d-neon--pulse',e.target.checked)));
document.querySelector('#background').addEventListener('change',e=>{document.body.classList.remove('light','heroes');if(e.target.value)document.body.classList.add(e.target.value);});
</script></body></html>`);
console.log('Packaged 8 assets, 2 series review sheets, and the adjustable neon preview.');
