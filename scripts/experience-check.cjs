const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = 'http://localhost:3100';
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3200);
    assert(await page.locator('.hero-primary').evaluate(el => el.getBoundingClientRect().bottom < innerHeight), 'Homepage CTA should fit in the first screen');
    assert(await page.locator('.hero-copy h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize) <= 64), 'Hero type must remain restrained');
    await page.getByRole('button', { name: 'Show Custom ERP', exact: true }).click();
    assert.equal(await page.locator('.hero-project-info h2').textContent(), 'Custom ERP');
    await page.getByRole('button', { name: 'Show FruitUp', exact: true }).click();
    await page.waitForTimeout(750);
    await page.screenshot({ path: 'reference/previews/experience-home.png' });
    const positions = [];
    for (const y of [0, 70, 140, 210, 280]) {
      await page.evaluate(y => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0,y), y);
      await page.waitForTimeout(650);
      positions.push(await page.locator('.fluid-nav .logo').evaluate(el => el.getBoundingClientRect().x));
    }
    assert(positions.every((x, i) => !i || x > positions[i - 1]), `Navbar must move continuously: ${positions}`);
    assert(positions.slice(1).every((x,i) => x - positions[i] < 30), 'No abrupt logo jump');
    await page.getByRole('button', { name: /Business Technology/ }).click();
    assert.equal(await page.getByRole('button', { name: /Business Technology/ }).getAttribute('aria-expanded'), 'true');
    await page.locator('.experience-work').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reference/previews/experience-selected-work.png' });
    await page.goto(base + '/work', { waitUntil: 'networkidle' });
    const reelTop = await page.locator('.dimensional-reel').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(y => window.__lenis.scrollTo(y, { immediate:true }), reelTop + 1);
    await page.waitForTimeout(1300);
    await page.getByRole('button', { name:'Next project', exact:true }).click();
    await page.waitForTimeout(2500);
    assert.equal(await page.locator('.reel-name').textContent(), 'Chanakya Properties');
    const backgroundBefore = await page.locator('.reel-light').evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(800);
    assert.notEqual(await page.locator('.reel-light').evaluate(el => getComputedStyle(el).transform), backgroundBefore, 'Reel background should animate');
    await page.screenshot({ path:'reference/previews/experience-reel.png' });
    await page.locator('.dimensional-reel').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(2500);
    assert.equal(await page.locator('.reel-name').textContent(), 'Custom ERP');
    for (const width of [390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/about', '/services', '/work', '/blog', '/client-stories', '/contact', '/work/fruitup']) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${route} at ${width}`);
        assert(await page.locator('main h1').count(), `Missing heading ${route}`);
        if (width === 1440 && ['/about','/services','/contact'].includes(route)) {
          await page.waitForTimeout(1000);
          await page.screenshot({ path:'reference/previews/redesign-' + route.slice(1) + '.png' });
        }
      }
    }
    await page.setViewportSize({ width:390,height:844 });
    await page.goto(base, { waitUntil:'networkidle' });
    await page.waitForTimeout(1000);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 550) { window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); await new Promise(r => setTimeout(r, 170)); } });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path:'reference/previews/experience-mobile.png', fullPage:true });
    await page.getByRole('button', { name:'Open navigation' }).click();
    assert(await page.locator('#mobile-navigation').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-navigation').count(), 0);
    await page.goto(base + '/work', { waitUntil:'networkidle' });
    await page.getByRole('button', { name:'Next project', exact:true }).click();
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('.reel-name').textContent(), 'Chanakya Properties');
    await page.emulateMedia({ reducedMotion:'reduce' });
    await page.reload({ waitUntil:'networkidle' });
    await page.getByRole('button', { name:'Next project', exact:true }).click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.reel-name').textContent(), 'Chanakya Properties');
    await page.getByRole('link', { name:'View Chanakya Properties', exact:true }).click();
    await page.waitForURL('**/work/chanakya-properties');
    assert.deepEqual(errors, []);
    console.log('PASS: first-screen CTA, bounded type scale, project selector, continuous navbar positions ' + positions.join(', ') + '; services, animated reel background, desktop/mobile reel, keyboard, links, 8 pages at 4 widths, reduced motion, no browser errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
