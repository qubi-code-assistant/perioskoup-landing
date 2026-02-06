import { test } from '@playwright/test';

test('spacing compare', async ({ page }) => {
  // Homepage
  await page.goto('https://perioskouplandingdoctor.vercel.app/');
  await page.waitForTimeout(500);
  
  const homeSpacing = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const navInner = nav.querySelector('div'); // max-w-7xl container
    const logo = nav.querySelector('img');
    const navStyle = window.getComputedStyle(nav);
    const innerStyle = window.getComputedStyle(navInner);
    const logoRect = logo.getBoundingClientRect();
    return {
      navPadding: navStyle.padding,
      innerMaxWidth: innerStyle.maxWidth,
      innerPadding: innerStyle.padding,
      innerMargin: innerStyle.margin,
      logoLeft: logoRect.left,
      logoTop: logoRect.top
    };
  });
  console.log('HOME:', JSON.stringify(homeSpacing, null, 2));
  
  // Blog
  await page.goto('https://perioskouplandingdoctor.vercel.app/blog');
  await page.waitForTimeout(500);
  
  const blogSpacing = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const navInner = nav.querySelector('div');
    const logo = nav.querySelector('img');
    const navStyle = window.getComputedStyle(nav);
    const innerStyle = window.getComputedStyle(navInner);
    const logoRect = logo.getBoundingClientRect();
    return {
      navPadding: navStyle.padding,
      innerMaxWidth: innerStyle.maxWidth,
      innerPadding: innerStyle.padding,
      innerMargin: innerStyle.margin,
      logoLeft: logoRect.left,
      logoTop: logoRect.top
    };
  });
  console.log('BLOG:', JSON.stringify(blogSpacing, null, 2));
});
