const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.fill('input[name="username"]', 'superadmin');
    await page.fill('input[name="password"]', 'super123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    
    await page.goto('http://localhost:3001/reports/7bb0db61-ddd1-4499-a273-c86741f128bf', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/report-ui-fixed.png', fullPage: true });
    console.log('Screenshot saved');
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
