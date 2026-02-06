import { test } from '@playwright/test';

test('check inner padding', async ({ page }) => {
  await page.goto('https://perioskouplandingdoctor.vercel.app/');
  await page.waitForTimeout(500);
  
  const home = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const inner = nav.querySelector('.max-w-7xl');
    const innerStyle = window.getComputedStyle(inner);
    return {
      padding: innerStyle.padding,
      paddingLeft: innerStyle.paddingLeft,
      paddingRight: innerStyle.paddingRight,
      className: inner.className
    };
  });
  console.log('HOME INNER:', JSON.stringify(home));
  
  await page.goto('https://perioskouplandingdoctor.vercel.app/blog');
  await page.waitForTimeout(500);
  
  const blog = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const inner = nav.querySelector('.max-w-7xl');
    const innerStyle = window.getComputedStyle(inner);
    return {
      padding: innerStyle.padding,
      paddingLeft: innerStyle.paddingLeft,
      paddingRight: innerStyle.paddingRight,
      className: inner.className
    };
  });
  console.log('BLOG INNER:', JSON.stringify(blog));
});
