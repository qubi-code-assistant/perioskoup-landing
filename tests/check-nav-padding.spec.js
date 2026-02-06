import { test } from '@playwright/test';

test('check nav padding', async ({ page }) => {
  await page.goto('https://perioskouplandingdoctor.vercel.app/');
  await page.waitForTimeout(500);
  
  const homeNav = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const style = window.getComputedStyle(nav);
    return {
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      margin: style.margin
    };
  });
  console.log('HOME NAV:', JSON.stringify(homeNav));
  
  await page.goto('https://perioskouplandingdoctor.vercel.app/blog');
  await page.waitForTimeout(500);
  
  const blogNav = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const style = window.getComputedStyle(nav);
    return {
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      margin: style.margin
    };
  });
  console.log('BLOG NAV:', JSON.stringify(blogNav));
});
