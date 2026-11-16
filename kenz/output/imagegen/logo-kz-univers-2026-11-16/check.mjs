import { chromium } from '/Users/kenz15/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file:///Users/kenz15/Documents/Dev/Kenz/kenz/maquettes/v6/assets/logo3d/univers/index.html');
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
  await page.screenshot({ path: new URL('gallery-dark.png', import.meta.url).pathname, fullPage: true });
  const images = await page.evaluate(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  const cards = await page.locator('.card').count();
  await page.locator('[data-theme="light"]').click();
  const light = await page.locator('body').evaluate(el => el.classList.contains('light'));
  await page.locator('#neon').fill('70');
  const neon = await page.locator('.hero3d-neon__glow').first().evaluate(el => getComputedStyle(el).opacity);
  await page.screenshot({ path: new URL('gallery-light.png', import.meta.url).pathname, fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileFits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  await page.screenshot({ path: new URL('gallery-mobile.png', import.meta.url).pathname, fullPage: true });
  const report = { cards, allImagesLoaded: images, lightToggle: light, neonOpacityAt70: neon, mobileFits, errors };
  await fs.writeFile(new URL('browser-validation.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
  if (cards !== 2 || !images || !light || neon !== '0.7' || !mobileFits || errors.length) process.exitCode = 1;
} finally { await browser.close(); }
