const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await page.fill('input[name="username"]', 'superadmin');
    await page.fill('input[name="password"]', 'super123');
    
    await page.screenshot({ path: '/tmp/login-filled.png', fullPage: true });
    console.log('Login form filled, screenshot saved');
    console.log('URL:', page.url());
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
