// Quick sanity check for navbar and fonts on all pages
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://perioskouplandingdoctor.vercel.app';

const PAGES = [
  '/calculator.html',
  '/privacy.html', 
  '/contact.html',
  '/signup.html',
  '/periochamp.html',
  '/blog/',
];

for (const path of PAGES) {
  test(`${path} has navbar and correct font`, async ({ page }) => {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
    
    // Check navbar exists
    const nav = page.locator('nav#navbar');
    await expect(nav).toBeVisible({ timeout: 10000 });
    
    // Check logo
    const logo = nav.locator('img[alt*="Logo"]');
    await expect(logo).toBeVisible();
    
    // Check font is Gabarito (not Nunito)
    const bodyFont = await page.evaluate(() => 
      window.getComputedStyle(document.body).fontFamily
    );
    expect(bodyFont.toLowerCase()).toContain('gabarito');
    expect(bodyFont.toLowerCase()).not.toContain('nunito');
  });
}
