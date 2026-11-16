import { chromium } from '/Users/kenz15/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const file = (await stat(path)).isDirectory() ? resolve(path, 'index.html') : path;
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/heros`;
const errors = [];
let browser;
const report = [];
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width:1440, height:900 }, deviceScaleFactor:1 });
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  for (const direction of ['horizon','passage','atlas']) {
    for (const mode of ['pro','createur']) {
      await page.goto(`${base}/scene.html?direction=${direction}&mode=${mode}&capture=1`);
      await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]));
      await page.waitForTimeout(1100);
      const broken = await page.evaluate(() => [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src));
      assert.deepEqual(broken, [], 'All images load');
      await page.screenshot({ path:resolve(import.meta.dirname, `previews/${direction}-${mode}.jpg`), type:'jpeg', quality:88 });
      report.push(`${direction}/${mode}: loaded and captured`);
    }
  }
  await page.goto(`${base}/scene.html?direction=horizon&mode=pro`);
  await page.getByRole('button', { name:'Créateur', exact:true }).click();
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'createur');
  await page.getByRole('button', { name:'02 Passage', exact:true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.direction === 'passage');
  assert.match(page.url(), /direction=passage/);
  await page.getByRole('button', { name:'Pro', exact:true }).click();
  await page.waitForTimeout(1100);
  const before = await page.locator('.landscape').first().evaluate(el => el.style.transform);
  await page.evaluate(() => scrollTo({top:440,behavior:'instant'}));
  await page.waitForTimeout(250);
  const after = await page.locator('.landscape').first().evaluate(el => el.style.transform);
  assert.notEqual(before, after, 'Scroll moves background');
  const portrait = await page.locator('.portrait-stage').evaluate(el => el.style.transform);
  assert.notEqual(after, portrait, 'Portrait moves at a different speed');
  await page.screenshot({ path:resolve(import.meta.dirname,'previews/scroll-desktop.jpg'),type:'jpeg',quality:85 });
  report.push('Mode switch, direction switch, URL synchronization and separate parallax speeds pass');
  await page.getByRole('button', { name:'Désactiver le parallaxe', exact:true }).click();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.portrait-stage').evaluate(el => getComputedStyle(el).transform), 'matrix(1, 0, 0, 1, 0, 0)');
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.reload();
  assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'false');
  report.push('Manual motion pause and prefers-reduced-motion pass');
  await page.emulateMedia({ reducedMotion:'no-preference' });
  for (const width of [390, 320]) {
    await page.setViewportSize({width,height:844});
    for (const mode of ['pro','createur']) {
      await page.goto(`${base}/scene.html?direction=horizon&mode=${mode}`);
      await page.waitForTimeout(1100);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      const dock = await page.locator('.preview-dock').boundingBox();
      assert(dock.x >= 0 && dock.x + dock.width <= width, 'Controls stay in viewport');
      await page.screenshot({path:resolve(import.meta.dirname,`previews/mobile-${width}-${mode}.jpg`),type:'jpeg',quality:88});
    }
  }
  report.push('320px and 390px mobile: both modes fit with visible controls');
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${base}/index.html`);
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    return Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode())]);
  });
  assert.equal(await page.locator('.preview-card').count(),6);
  const thumb = await page.locator('.preview-card img').first().boundingBox();
  assert(Math.abs(thumb.width / thumb.height - 1.6) < .01, 'Gallery preserves full hero aspect ratio');
  await page.screenshot({path:resolve(import.meta.dirname,'previews/comparison.jpg'),fullPage:true,type:'jpeg',quality:90});
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Gallery fits mobile');
  assert.deepEqual(errors, [], 'No browser errors or failed requests');
  await writeFile(resolve(import.meta.dirname,'previews/verification.json'),JSON.stringify({checkedAt:new Date().toISOString(),report,errors},null,2));
  console.log(JSON.stringify({passed:true,report,errors},null,2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
