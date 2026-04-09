const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL: 'http://localhost:3001'
  });
  const page = await context.newPage();
  
  try {
    // Go to login
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    console.log('Login URL:', page.url());
    
    // Fill form
    await page.fill('input[name="username"]', 'superadmin');
    await page.fill('input[name="password"]', 'super123');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(5000);
    console.log('After login URL:', page.url());
    
    // Go to report
    await page.goto('/reports/7bb0db61-ddd1-4499-a273-c86741f128bf', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    console.log('Report page URL:', page.url());
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/report-page-logged-in.png', fullPage: true });
    console.log('Screenshot saved');
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
