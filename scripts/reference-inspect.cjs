const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
(async () => {
  fs.mkdirSync('reference/creative-direction', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const [name, url] of [['zentry','https://zentry.com/'],['unseen','https://unseen.co/'],['rejouice','https://www.rejouice.com/']]) {
      const page = await browser.newPage({ viewport: { width:1440, height:1000 } });
      try {
        const response = await page.goto(url, { waitUntil:'domcontentloaded', timeout:45000 });
        await page.waitForTimeout(6500);
        const enter = page.getByText('Enter without audio', {exact:true});
        if (await enter.isVisible().catch(() => false)) { await enter.click(); await page.waitForTimeout(3500); }
        await page.screenshot({path:`reference/creative-direction/${name}-top.png`});
        await page.mouse.wheel(0,850);
        await page.waitForTimeout(2500);
        await page.screenshot({path:`reference/creative-direction/${name}-scroll.png`});
        console.log(JSON.stringify({name,status:response?.status(),title:await page.title(),canvas:await page.locator('canvas').count(),video:await page.locator('video').count()}));
      } catch(e) { console.log(name + ': ' + e.message); }
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
