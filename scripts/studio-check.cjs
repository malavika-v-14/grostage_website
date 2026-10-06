// Run against a local preview; PLAYWRIGHT_PATH can point to an existing installation.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = process.env.PREVIEW_URL || 'http://localhost:3100';
    fs.mkdirSync('reference/previews', { recursive: true });
    await page.goto(base, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(3500);
    assert.equal(await page.locator('.studio-nav').evaluate(el => getComputedStyle(el).borderBottomWidth), '0px');
    assert.equal(await page.locator('.studio-nav').evaluate(el => el.classList.contains('is-scrolled')), false);
    await page.screenshot({ path: 'reference/previews/studio-home-top.png' });
    await page.locator('.studio-showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    assert(await page.locator('.studio-nav').evaluate(el => el.classList.contains('is-scrolled')));
    await page.getByRole('button', { name: 'Next project', exact: true }).click();
    await page.waitForTimeout(800);
    assert.equal(await page.locator('.studio-project-copy h3').textContent(), 'Chanakya Properties');
    await page.locator('.studio-project-stage').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
    assert.equal(await page.locator('.studio-project-copy h3').textContent(), 'Custom ERP');
    await page.getByRole('button', { name: 'Show FruitUp', exact: true }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reference/previews/studio-home-work.png' });
    await page.goto(base + '/work', { waitUntil: 'networkidle' });
    await page.locator('.studio-showcase').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Next project', exact: true }).click();
    await page.waitForTimeout(800);
    assert.equal(await page.locator('.studio-project-copy h3').textContent(), 'Chanakya Properties');
    await page.screenshot({ path: 'reference/previews/studio-work-gallery.png' });
    await page.getByRole('button', { name: 'Business systems', exact: true }).click();
    assert.equal(await page.locator('.work-grid .project-card').count(), 1);
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/work', '/about', '/contact']) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${route} at ${width}`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open navigation' }).click();
    assert(await page.locator('#mobile-navigation').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-navigation').count(), 0);
    await page.locator('.studio-showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'reference/previews/studio-mobile.png' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Show Warehouse App', exact: true }).click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.studio-project-copy h3').textContent(), 'Warehouse App');
    await page.locator('.studio-image-link').click();
    await page.waitForURL('**/work/warehouse-app');
    assert.deepEqual(errors, []);
    console.log('PASS: header scroll, carousel controls, keyboard, filters, mobile navigation, four responsive widths, reduced motion, project links; no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
