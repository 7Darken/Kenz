import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../../..');
const output = path.join(root, 'maquettes/v6/assets/logo3d');
const sourceManifest = JSON.parse(await fs.readFile(new URL('manifest.json', import.meta.url), 'utf8'));
const assets = sourceManifest.assets;
await fs.mkdir(output, { recursive: true });
await fs.mkdir(new URL('sources/', import.meta.url), { recursive: true });
for (const sub of ['512', '256', 'planches']) await fs.mkdir(path.join(output, sub), { recursive: true });
const validation = [];

for (const asset of assets) {
  await fs.copyFile(asset.source, new URL('sources/' + asset.id + '.png', import.meta.url));
  const { data, info } = await sharp(asset.source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1, empty = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const alpha = data[(y * info.width + x) * 4 + 3];
    if (alpha === 0) empty++;
    // Measure visible content without changing any generated alpha values.
    if (alpha <= 8) continue;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < 0 || empty < info.width * info.height * .1) throw new Error('Invalid transparency: ' + asset.id);
  left = Math.max(0, left - 4); top = Math.max(0, top - 4);
  right = Math.min(info.width - 1, right + 4); bottom = Math.min(info.height - 1, bottom + 4);
  const object = await sharp(asset.source).extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .resize({ width: 820, height: 820, fit: 'inside' }).png().toBuffer();
  const master = await sharp(object).resize({ width: 1024, height: 1024, fit: 'contain', withoutEnlargement: true,
    background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const exports = [];
  for (const size of [1024, 512, 256]) {
    const file = path.join(output, size === 1024 ? '' : String(size), asset.id + '.webp');
    await sharp(master).resize(size, size).webp(size === 1024 ? { lossless: true, effort: 6 } : { quality: 96, alphaQuality: 100, effort: 6 }).toFile(file);
    const meta = await sharp(file).metadata();
    if (meta.width !== size || meta.height !== size || !meta.hasAlpha) throw new Error('Invalid export: ' + file);
    exports.push({ file: path.relative(output, file), width: size, height: size, hasAlpha: true, bytes: (await fs.stat(file)).size });
  }
  await fs.writeFile(path.join(output, asset.id + '.txt'), asset.prompt + '\n');
  validation.push({ id: asset.id, sourceTransparentPixels: empty, exports });
}

for (const name of ['neon.css', 'neon-filter.svg']) await fs.copyFile(path.join(root, 'maquettes/v6/assets/hero3d', name), path.join(output, name));
const filter = await fs.readFile(path.join(output, 'neon-filter.svg'), 'utf8');
const safe = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const logo = (a, size, main = false) => `<span class="hero3d-neon" style="width:${size}px;max-width:100%"><img src="${main ? '' : '256/'}${a.id}.webp" width="${main ? 1024 : 256}" height="${main ? 1024 : 256}" alt="${main ? 'Logo KZ — ' + safe(a.name) : ''}"><img class="hero3d-neon__glow" src="${main ? '' : '256/'}${a.id}.webp" width="${main ? 1024 : 256}" height="${main ? 1024 : 256}" alt="" aria-hidden="true"></span>`;
const cards = assets.map((a, i) => `<article class="card"><div class="stage"><span class="number">0${i + 1}</span>${logo(a, 380, true)}</div><div class="details"><h2>${safe(a.name)}</h2><p>${safe(a.description)}</p><div class="small-sizes"><div>${logo(a, 80)}<span>80 px</span></div><div>${logo(a, 48)}<span>48 px</span></div><div>${logo(a, 32)}<span>32 px</span></div></div><nav aria-label="Fichiers ${safe(a.name)}"><a href="${a.id}.webp" download>WebP 1024</a><a href="512/${a.id}.webp" download>512</a><a href="256/${a.id}.webp" download>256</a><a href="${a.id}.txt">Prompt</a></nav></div></article>`).join('\n');
const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KZ — Quatre pistes de logo</title><link rel="stylesheet" href="neon.css">
<style>
:root{color-scheme:dark;--page:#101614;--panel:#18211e;--stage:#0b100e;--ink:#f3f0e9;--muted:#a4b6ae;--line:#34443d;--cyan:#64cedc;--logo-neon:.35}
*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:background .2s,color .2s}
body.light{color-scheme:light;--page:#f5f1e8;--panel:#fffdf7;--stage:#ebe6db;--ink:#17251f;--muted:#52665b;--line:#d1d9ce;--cyan:#127487}
main{max-width:1180px;margin:auto;padding:52px 28px 32px}.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.2em;color:var(--cyan);margin:0 0 12px}h1{font-size:clamp(36px,6vw,64px);letter-spacing:-.055em;line-height:1.05;margin:0 0 16px;font-weight:650}header>p:last-child{color:var(--muted);margin:0;max-width:650px}
.controls{display:flex;align-items:center;flex-wrap:wrap;gap:16px 28px;margin:30px 0 24px;padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.themes{display:flex;gap:6px}button{border:1px solid var(--line);border-radius:24px;background:transparent;color:var(--ink);padding:9px 16px;cursor:pointer;font:inherit;font-size:13px}button[aria-pressed=true]{background:var(--ink);color:var(--page);border-color:var(--ink)}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--cyan);outline-offset:4px}.neon-control{display:flex;align-items:center;gap:12px;font-size:13px}.neon-control input{width:125px;accent-color:var(--cyan)}output{min-width:36px;font-variant-numeric:tabular-nums}.format{font-size:12px;color:var(--muted);margin-left:auto}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.card{border:1px solid var(--line);border-radius:24px;overflow:hidden;background:var(--panel)}.stage{position:relative;display:flex;align-items:center;justify-content:center;min-height:370px;background:var(--stage);padding:10px 28px}.number{position:absolute;top:20px;left:23px;color:var(--muted);font-size:12px;letter-spacing:.1em}.hero3d-neon{--neon-strength:var(--logo-neon)}.details{padding:22px 26px 24px}.details h2{font-size:23px;letter-spacing:-.03em;margin:0 0 7px}.details p{margin:0;color:var(--muted);font-size:14px;min-height:42px}.small-sizes{display:flex;align-items:flex-end;gap:24px;margin:17px 0 20px;min-height:100px}.small-sizes>div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px}.small-sizes>div>span:last-child{font-size:11px;color:var(--muted)}nav{display:flex;flex-wrap:wrap;gap:17px}a{color:inherit;text-underline-offset:4px;font-size:12px}footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px;margin-top:28px}
@media(max-width:640px){main{padding:30px 16px}.grid{grid-template-columns:1fr}.stage{min-height:280px;padding:8px 24px}.format{margin-left:0;width:100%}.controls{gap:15px}.details{padding:20px}.details p{min-height:0}.neon-control{gap:8px}.neon-control input{width:100px}}
@media(prefers-reduced-motion:reduce){body{transition:none}}
</style></head><body>${filter}<main><header><p class="eyebrow">Identité personnelle · Explorations 3D</p><h1>KZ, quatre directions.</h1><p>Graphite mat, ivoire et touches Lagon. Compare les silhouettes, les détails et la lecture en petit format.</p></header><div class="controls"><div class="themes" role="group" aria-label="Fond de prévisualisation"><button type="button" data-theme="dark" aria-pressed="true">Fond sombre</button><button type="button" data-theme="light" aria-pressed="false">Fond clair</button></div><label class="neon-control">Néon <input id="neon" type="range" min="0" max="100" value="35"><output id="strength" for="neon">35 %</output></label><span class="format">4 concepts · WebP transparent</span></div><section class="grid" aria-label="Propositions de logos">${cards}</section><footer><span>Propositions créées avec imagegen · Prompts joints à chaque logo</span><span><a href="planches/comparatif-sombre.webp">Planche sombre</a> · <a href="planches/comparatif-clair.webp">Planche claire</a></span></footer></main><script>
const range=document.getElementById('neon'),strength=document.getElementById('strength');range.addEventListener('input',()=>{document.documentElement.style.setProperty('--logo-neon',range.value/100);strength.value=range.value+' %'});document.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',()=>{document.body.classList.toggle('light',button.dataset.theme==='light');document.querySelectorAll('[data-theme]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)))}));
</script></body></html>`;
await fs.writeFile(path.join(output, 'index.html'), html);

// Opaque comparison boards; raster artwork is only resized and composited.
for (const theme of ['sombre', 'clair']) {
  const dark = theme === 'sombre';
  const bg = dark ? '#101614' : '#f5f1e8', panel = dark ? '#19221e' : '#eae5da', ink = dark ? '#f3f0e9' : '#17251f', muted = dark ? '#a4b6ae' : '#52665b';
  let labels = `<svg width="1400" height="1430"><rect width="1400" height="1430" fill="${bg}"/><g font-family="Arial,sans-serif"><text x="64" y="66" fill="${muted}" font-size="13" letter-spacing="3">IDENTITÉ PERSONNELLE · QUATRE PISTES</text><text x="60" y="128" fill="${ink}" font-weight="700" font-size="53">KZ, en volume.</text>`;
  const composites = [];
  for (const [i, asset] of assets.entries()) {
    const x = 48 + (i % 2) * 664, y = 178 + Math.floor(i / 2) * 608;
    labels += `<rect x="${x}" y="${y}" width="640" height="580" rx="24" fill="${panel}"/><text x="${x + 28}" y="${y + 42}" fill="${muted}" font-size="14">0${i + 1}</text><text x="${x + 28}" y="${y + 502}" fill="${ink}" font-size="27" font-weight="700">${safe(asset.name)}</text><text x="${x + 28}" y="${y + 537}" fill="${muted}" font-size="15">${safe(asset.description)}</text>`;
    composites.push({ input: await sharp(path.join(output, asset.id + '.webp')).resize(440, 440).png().toBuffer(), left: x + 100, top: y + 16 });
    composites.push({ input: await sharp(path.join(output, asset.id + '.webp')).resize(64, 64).png().toBuffer(), left: x + 540, top: y + 441 });
  }
  labels += '</g></svg>';
  await sharp(Buffer.from(labels)).composite(composites).webp({ quality: 94, effort: 6 }).toFile(path.join(output, 'planches', 'comparatif-' + theme + '.webp'));
}
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify({ generator: sourceManifest.generator, created: sourceManifest.created, status: 'proposals-awaiting-choice', sizes: [1024, 512, 256], format: 'WebP with alpha', neon: 'Optional CSS overlay; inline neon-filter.svg once', assets: assets.map(({ id, name, description }) => ({ id, name, description, image: id + '.webp', prompt: id + '.txt' })) }, null, 2) + '\n');
await fs.writeFile(path.join(output, 'validation.json'), JSON.stringify({ status: 'export-verified', assets: validation }, null, 2) + '\n');
console.log(JSON.stringify({ output, concepts: assets.length, exports: validation.flatMap(a => a.exports).length, bytes: validation.flatMap(a => a.exports).reduce((sum, a) => sum + a.bytes, 0) }, null, 2));
