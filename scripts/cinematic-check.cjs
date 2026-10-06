const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PREVIEW_URL || 'http://localhost:3100';
(async () => {
  fs.mkdirSync('reference/previews', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const scroll = y => page.evaluate(y => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y), y);
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'reference/previews/cinematic-home.png' });
    assert(await page.locator('.stage-pill').first().evaluate(el => el.getBoundingClientRect().bottom <= innerHeight), 'Hero CTA visible');
    assert.equal(await page.locator('.fluid-nav').getAttribute('data-theme'), 'dark');
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    await page.waitForTimeout(650);
    assert(await page.locator('#studio-navigation').isVisible());
    assert(await page.locator('#studio-navigation').evaluate(el => el.contains(document.activeElement)), 'Menu focus');
    await page.screenshot({ path: 'reference/previews/cinematic-menu.png' });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(650);
    assert.equal(await page.getByRole('button', { name: 'Open navigation', exact: true }).getAttribute('aria-expanded'), 'false');
    const manifesto = await page.locator('.stage-manifesto').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await scroll(manifesto + 20); await page.waitForTimeout(1000);
    assert.equal(await page.locator('.fluid-nav').getAttribute('data-theme'), 'light');
    const theatre = await page.locator('.project-theatre').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await scroll(theatre + 1); await page.waitForTimeout(1300);
    await page.screenshot({ path: 'reference/previews/cinematic-work.png' });
    await page.getByRole('button', { name: 'Next featured project' }).click();
    await page.waitForTimeout(2200);
    assert.equal(await page.locator('.theatre-project').nth(1).evaluate(el => el.inert), false);
    await page.screenshot({ path: 'reference/previews/cinematic-work-next.png' });
    await page.locator('.theatre-heading a').click();
    await page.waitForURL('**/work'); await page.waitForTimeout(1500);
    assert.equal(await page.locator('main h1').count(), 1);
    const reel = await page.locator('.dimensional-reel').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await scroll(reel + 1); await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'Next project', exact: true }).click();
    await page.waitForTimeout(2400);
    assert.equal(await page.locator('.reel-name').textContent(), 'Chanakya Properties');
    assert.equal(await page.locator('.fluid-nav').getAttribute('data-theme'), 'dark', 'Pinned reel header theme');
    await page.screenshot({ path: 'reference/previews/cinematic-reel.png' });
    console.log('Desktop hero, theme switching, menu, project theatre, route transition and work reel passed.');
    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/about', '/services', '/work', '/blog', '/client-stories', '/contact', '/work/fruitup']) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.waitForTimeout(250);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${route} at ${width}`);
        assert(await page.locator('main h1').count(), `Heading ${route}`);
        if (width === 1440 && ['/about', '/services', '/contact'].includes(route)) {
          await page.waitForTimeout(900);
          await page.screenshot({ path: `reference/previews/cinematic-${route.slice(1)}.png` });
        }
      }
      console.log(`Eight routes passed at ${width}px.`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
    await page.screenshot({ path: 'reference/previews/cinematic-mobile.png' });
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click(); await page.waitForTimeout(650);
    await page.screenshot({ path: 'reference/previews/cinematic-mobile-menu.png' });
    await page.keyboard.press('Escape');
    await page.goto(base + '/work', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Business systems', exact: true }).click();
    assert.equal(await page.locator('.work-grid .project-card').count(), 1);
    await page.getByRole('button', { name: 'All work', exact: true }).click();
    assert(await page.locator('.work-grid .project-card').count() > 1);
    await page.goto(base, { waitUntil: 'networkidle' });
    const capability = page.locator('.capability-toggle').nth(1);
    await capability.click();
    assert.equal(await capability.getAttribute('aria-expanded'), 'true');
    await page.goto(base + '/contact', { waitUntil: 'networkidle' });
    let payload;
    await page.route('**/api/contact', async route => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.getByLabel('Your name').fill('UI verification');
    await page.getByLabel('Email address').fill('ui-check@example.com');
    await page.getByLabel('What are you thinking?').fill('Mocked UI test: no submission is persisted.');
    await page.getByRole('button', { name: /start a conversation/ }).click();
    await page.getByRole('status').filter({ hasText: 'Thank you' }).waitFor();
    assert.equal(payload.name, 'UI verification');
    assert.equal(await page.getByLabel('Your name').inputValue(), '');
    await page.unroute('**/api/contact');
    console.log('Work filtering, capabilities and mocked contact-form success passed (no database writes).');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.project-theatre').evaluate(el => el.querySelectorAll('[inert]').length), 0);
    assert.equal(await page.locator('.gs-cursor').evaluate(el => getComputedStyle(el).display), 'none');
    assert.equal(await page.locator('.theatre-project').first().evaluate(el => getComputedStyle(el).position), 'relative');
    assert.deepEqual(errors, [], 'Browser exceptions');
    console.log('Mobile, reduced motion and browser error checks passed.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
