import { test, expect } from '@playwright/test';

test('compare navbars', async ({ page }) => {
  // Homepage
  await page.goto('https://perioskouplandingdoctor.vercel.app/');
  await page.waitForTimeout(1000);
  
  const homeStyles = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const link = nav.querySelector('a[href*="how-it-works"]');
    const logo = nav.querySelector('img');
    const linkStyle = window.getComputedStyle(link);
    const logoStyle = window.getComputedStyle(logo);
    return {
      fontFamily: linkStyle.fontFamily,
      fontSize: linkStyle.fontSize,
      fontWeight: linkStyle.fontWeight,
      letterSpacing: linkStyle.letterSpacing,
      color: linkStyle.color,
      logoHeight: logoStyle.height
    };
  });
  console.log('HOME:', JSON.stringify(homeStyles));
  
  // Blog
  await page.goto('https://perioskouplandingdoctor.vercel.app/blog');
  await page.waitForTimeout(1000);
  
  const blogStyles = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const link = nav.querySelector('a[href*="how-it-works"]');
    const logo = nav.querySelector('img');
    const linkStyle = window.getComputedStyle(link);
    const logoStyle = window.getComputedStyle(logo);
    return {
      fontFamily: linkStyle.fontFamily,
      fontSize: linkStyle.fontSize,
      fontWeight: linkStyle.fontWeight,
      letterSpacing: linkStyle.letterSpacing,
      color: linkStyle.color,
      logoHeight: logoStyle.height
    };
  });
  console.log('BLOG:', JSON.stringify(blogStyles));
});
