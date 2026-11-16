import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../../..');
const base = path.join(root, 'maquettes/v6/assets/logo3d');
const out = path.join(base, 'univers');
const source = JSON.parse(await fs.readFile(new URL('source.json', import.meta.url), 'utf8'));
for (const dir of ['', '512', '256', 'planches']) await fs.mkdir(path.join(out, dir), { recursive: true });
await fs.copyFile(source.source, new URL('kz-createur-source.png', import.meta.url));
const { data, info } = await sharp(source.source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = -1, bottom = -1, transparent = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  const alpha = data[(y * info.width + x) * 4 + 3];
  if (alpha === 0) transparent++;
  if (alpha <= 8) continue;
  left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
}
if (right < 0 || transparent < info.width * info.height * .1) throw new Error('Invalid transparent source');
left = Math.max(0, left - 4); top = Math.max(0, top - 4); right = Math.min(info.width - 1, right + 4); bottom = Math.min(info.height - 1, bottom + 4);
const object = await sharp(source.source).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).resize({ width: 820, height: 820, fit: 'inside' }).png().toBuffer();
const master = await sharp(object).resize({ width: 1024, height: 1024, fit: 'contain', withoutEnlargement: true, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const report = [];
for (const size of [1024, 512, 256]) {
  const sub = size === 1024 ? '' : String(size);
  await fs.copyFile(path.join(base, sub, 'kz-01-monogramme.webp'), path.join(out, sub, 'kz-pro.webp'));
  await sharp(master).resize(size, size).webp(size === 1024 ? { lossless: true, effort: 6 } : { quality: 96, alphaQuality: 100, effort: 6 }).toFile(path.join(out, sub, 'kz-createur.webp'));
  for (const id of ['kz-pro', 'kz-createur']) {
    const file = path.join(out, sub, id + '.webp');
    const meta = await sharp(file).metadata();
    if (meta.width !== size || meta.height !== size || !meta.hasAlpha) throw new Error('Invalid export: ' + file);
    report.push({ file: path.relative(out, file), width: size, height: size, hasAlpha: true, bytes: (await fs.stat(file)).size });
  }
}
await fs.copyFile(path.join(base, 'kz-01-monogramme.txt'), path.join(out, 'kz-pro.txt'));
await fs.copyFile(new URL('kz-createur.txt', import.meta.url), path.join(out, 'kz-createur.txt'));
const assets = [
  { id: 'kz-pro', name: 'Espace Pro', palette: 'Graphite · Ivoire · Lagon', description: 'Le monogramme que tu as validé, dans sa finition originale.', status: 'approved-original' },
  { id: 'kz-createur', name: 'Espace Créateur', palette: 'Cognac · Ivoire · Lagon', description: 'La même signature, avec une matière plus chaleureuse.', status: 'new-variant' }
];
const image = (a, size, main = false) => `<span class="hero3d-neon" style="width:${size}px;max-width:100%"><img src="${main ? '' : '256/'}${a.id}.webp" width="${main ? 1024 : 256}" height="${main ? 1024 : 256}" alt="${main ? a.name + ' — monogramme KZ' : ''}"><img class="hero3d-neon__glow" src="${main ? '' : '256/'}${a.id}.webp" width="${main ? 1024 : 256}" height="${main ? 1024 : 256}" alt="" aria-hidden="true"></span>`;
const cards = assets.map(a => `<article class="card ${a.id}"><div class="stage">${image(a, 440, true)}</div><div class="details"><p class="palette">${a.palette}</p><h2>${a.name}</h2><p>${a.description}</p><div class="small-sizes">${[80, 48, 32].map(s => `<div>${image(a, s)}<span>${s} px</span></div>`).join('')}</div><nav aria-label="Télécharger ${a.name}"><a href="${a.id}.webp" download>WebP 1024</a><a href="512/${a.id}.webp" download>512</a><a href="256/${a.id}.webp" download>256</a><a href="${a.id}.txt">Prompt</a></nav></div></article>`).join('\n');
const previous = await fs.readFile(path.join(base, 'index.html'), 'utf8');
const html = previous
  .replace('<title>KZ — Quatre pistes de logo</title>', '<title>KZ — Pro &amp; Créateur</title>')
  .replace('href="neon.css"', 'href="../neon.css"')
  .replace('</style>', '.palette{font-size:11px!important;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan)!important;min-height:0!important;margin-bottom:8px!important}.stage{min-height:410px}.kz-createur .stage{background:#19130e}.light .kz-createur .stage{background:#eee3d5}.kz-createur .palette{color:#caa17b!important}.light .kz-createur .palette{color:#855231!important}@media(max-width:640px){.stage{min-height:280px}}\n</style>')
  .replace('Identité personnelle · Explorations 3D', 'Monogramme validé · Deux univers')
  .replace('KZ, quatre directions.', 'Une signature.<br>Deux univers.')
  .replace('Graphite mat, ivoire et touches Lagon. Compare les silhouettes, les détails et la lecture en petit format.', 'Graphite pour le Pro. Cognac pour le Créateur. Les mêmes initiales et le même trait Lagon pour relier tes deux espaces.')
  .replace('4 concepts · WebP transparent', '2 déclinaisons · WebP transparent')
  .replace(/<section class="grid"[\s\S]*?<\/section>/, '<section class="grid" aria-label="Déclinaisons Pro et Créateur">' + cards + '</section>')
  .replace('Propositions créées avec imagegen · Prompts joints à chaque logo', 'Monogramme Pro conservé · Déclinaison Créateur avec imagegen · Prompts joints')
  .replaceAll('comparatif-sombre.webp', 'duo-sombre.webp').replaceAll('comparatif-clair.webp', 'duo-clair.webp');
await fs.writeFile(path.join(out, 'index.html'), html);

for (const theme of ['sombre', 'clair']) {
  const dark = theme === 'sombre';
  const bg = dark ? '#101614' : '#f5f1e8', ink = dark ? '#f3f0e9' : '#17251f', muted = dark ? '#a4b6ae' : '#52665b';
  let svg = `<svg width="1400" height="840"><rect width="1400" height="840" fill="${bg}"/><g font-family="Arial,sans-serif"><text x="60" y="58" fill="${muted}" font-size="13" letter-spacing="3">MONOGRAMME VALIDÉ · PRO &amp; CRÉATEUR</text><text x="56" y="122" fill="${ink}" font-weight="700" font-size="49">Une signature. Deux univers.</text>`;
  const layers = [];
  for (const [i, a] of assets.entries()) {
    const x = 48 + i * 664, y = 170, panel = i === 0 ? (dark ? '#19221e' : '#eae5da') : (dark ? '#231a13' : '#eee3d5');
    svg += `<rect x="${x}" y="${y}" width="640" height="614" rx="24" fill="${panel}"/><text x="${x + 28}" y="${y + 505}" fill="${ink}" font-size="30" font-weight="700">${a.name}</text><text x="${x + 28}" y="${y + 541}" fill="${muted}" font-size="16">${a.palette}</text>`;
    layers.push({ input: await sharp(path.join(out, a.id + '.webp')).resize(520, 520).png().toBuffer(), left: x + 60, top: y - 7 });
    layers.push({ input: await sharp(path.join(out, a.id + '.webp')).resize(72, 72).png().toBuffer(), left: x + 530, top: y + 460 });
  }
  svg += '</g></svg>';
  await sharp(Buffer.from(svg)).composite(layers).webp({ quality: 94, effort: 6 }).toFile(path.join(out, 'planches', 'duo-' + theme + '.webp'));
}
await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify({ generator: 'built-in image_gen', created: '2026-11-16', approvedBase: '../kz-01-monogramme.webp', format: 'WebP transparent', sizes: [1024, 512, 256], assets, neon: { css: '../neon.css', inlineFilter: '../neon-filter.svg', intensity: .35 }, sources: { pro: 'Byte-identical copy of approved monogram', createur: 'Material edit of approved monogram via built-in image_gen' } }, null, 2) + '\n');
await fs.writeFile(path.join(out, 'validation.json'), JSON.stringify({ status: 'exports-verified', proUnmodified: true, exports: report }, null, 2) + '\n');
const manifest = JSON.parse(await fs.readFile(path.join(base, 'manifest.json'), 'utf8'));
manifest.status = 'monogram-approved'; manifest.selected = 'kz-01-monogramme'; manifest.universeVariants = 'univers/index.html';
await fs.writeFile(path.join(base, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ output: out, exports: report.length, bytes: report.reduce((total, a) => total + a.bytes, 0) }));
