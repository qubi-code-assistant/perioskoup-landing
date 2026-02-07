const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('https://perioskouplandingdoctor.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Scroll and capture at different positions
  const positions = [
    { y: 0, name: '01-hero' },
    { y: 800, name: '02-comparison-start' },
    { y: 1600, name: '03-comparison-mid' },
    { y: 2400, name: '04-testimonial' },
    { y: 3000, name: '05-award' },
    { y: 3800, name: '06-award-bottom' },
    { y: 4600, name: '07-faq' },
    { y: 5400, name: '08-pricing' },
    { y: 6200, name: '09-cta-footer' },
  ];
  
  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos.y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/${pos.name}.png` });
    console.log(`Captured ${pos.name} at y=${pos.y}`);
  }
  
  await browser.close();
  console.log('\nDone! Screenshots in /tmp/');
})();
