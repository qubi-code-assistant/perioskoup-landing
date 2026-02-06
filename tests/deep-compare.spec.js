import { test } from '@playwright/test';

test('deep compare', async ({ page }) => {
  // Homepage
  await page.goto('https://perioskouplandingdoctor.vercel.app/');
  await page.waitForTimeout(1000);
  
  const homeStyles = await page.evaluate(() => {
    const link = document.querySelector('nav a[href*="how-it-works"]');
    const style = window.getComputedStyle(link);
    const bodyStyle = window.getComputedStyle(document.body);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      fontSmoothing: style.webkitFontSmoothing || style.MozOsxFontSmoothing,
      textRendering: style.textRendering,
      color: style.color,
      bodyFontSmoothing: bodyStyle.webkitFontSmoothing,
      bodyTextRendering: bodyStyle.textRendering
    };
  });
  console.log('HOME:', JSON.stringify(homeStyles, null, 2));
  
  // Blog
  await page.goto('https://perioskouplandingdoctor.vercel.app/blog');
  await page.waitForTimeout(1000);
  
  const blogStyles = await page.evaluate(() => {
    const link = document.querySelector('nav a[href*="how-it-works"]');
    const style = window.getComputedStyle(link);
    const bodyStyle = window.getComputedStyle(document.body);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      fontSmoothing: style.webkitFontSmoothing || style.MozOsxFontSmoothing,
      textRendering: style.textRendering,
      color: style.color,
      bodyFontSmoothing: bodyStyle.webkitFontSmoothing,
      bodyTextRendering: bodyStyle.textRendering
    };
  });
  console.log('BLOG:', JSON.stringify(blogStyles, null, 2));
});
