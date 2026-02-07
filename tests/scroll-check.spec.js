import { test } from '@playwright/test';

test('screenshot signup page scrolled', async ({ page }) => {
  await page.goto('https://perioskouplandingdoctor.vercel.app/signup');
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/signup-scrolled.png' });
});
