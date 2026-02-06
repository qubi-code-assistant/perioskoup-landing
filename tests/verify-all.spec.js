import { test } from '@playwright/test';

const pages = [
  'https://perioskouplandingdoctor.vercel.app/',
  'https://perioskouplandingdoctor.vercel.app/blog',
  'https://perioskouplandingdoctor.vercel.app/calculator.html',
  'https://perioskouplandingdoctor.vercel.app/contact.html',
];

test('verify all navbars match', async ({ page }) => {
  for (const url of pages) {
    await page.goto(url);
    await page.waitForTimeout(500);
    
    const styles = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const link = nav.querySelector('a[href*="how-it-works"]');
      const logo = nav.querySelector('img');
      const linkStyle = window.getComputedStyle(link);
      const logoStyle = window.getComputedStyle(logo);
      const bodyStyle = window.getComputedStyle(document.body);
      return {
        fontFamily: linkStyle.fontFamily,
        fontSize: linkStyle.fontSize,
        fontWeight: linkStyle.fontWeight,
        bodyFont: bodyStyle.fontFamily,
        logoH: logoStyle.height
      };
    });
    console.log(url.split('/').pop() || 'HOME:', JSON.stringify(styles));
  }
});
