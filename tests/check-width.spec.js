import { test } from '@playwright/test';

test('check navbar widths', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 800 });
  
  await page.goto('https://perioskouplandingdoctor.vercel.app/');
  await page.waitForTimeout(500);
  
  const homeWidth = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const inner = nav.querySelector('.max-w-7xl');
    const navRect = nav.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    return {
      navWidth: navRect.width,
      innerWidth: innerRect.width,
      bodyWidth,
      scrollbarWidth,
      windowInnerWidth: window.innerWidth,
      docClientWidth: document.documentElement.clientWidth
    };
  });
  console.log('HOME:', JSON.stringify(homeWidth, null, 2));
  
  await page.goto('https://perioskouplandingdoctor.vercel.app/blog');
  await page.waitForTimeout(500);
  
  const blogWidth = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const inner = nav.querySelector('.max-w-7xl');
    const navRect = nav.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    return {
      navWidth: navRect.width,
      innerWidth: innerRect.width,
      bodyWidth,
      scrollbarWidth,
      windowInnerWidth: window.innerWidth,
      docClientWidth: document.documentElement.clientWidth
    };
  });
  console.log('BLOG:', JSON.stringify(blogWidth, null, 2));
});
