const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('https://perioskouplandingdoctor.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Get all sections with their IDs, classes, and approximate content
  const sections = await page.evaluate(() => {
    const results = [];
    const allSections = document.querySelectorAll('section, [id]');
    
    allSections.forEach((el, index) => {
      if (el.tagName === 'SECTION' || (el.id && el.offsetHeight > 100)) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const h2 = el.querySelector('h1, h2');
        results.push({
          index,
          tag: el.tagName,
          id: el.id || '(no id)',
          class: el.className.slice(0, 100),
          heading: h2 ? h2.textContent.trim().slice(0, 60) : '(no heading)',
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
          background: style.background.slice(0, 80),
        });
      }
    });
    return results;
  });
  
  console.log('\n=== HOMEPAGE SECTIONS (top to bottom) ===\n');
  sections.sort((a, b) => a.top - b.top);
  sections.forEach((s, i) => {
    console.log(`${i + 1}. [${s.id}] @ ${s.top}px (height: ${s.height}px)`);
    console.log(`   Heading: "${s.heading}"`);
    console.log(`   BG: ${s.background || 'inherit'}`);
    console.log('');
  });
  
  // Take full page screenshot
  await page.screenshot({ path: '/tmp/homepage-full.png', fullPage: true });
  console.log('Full page screenshot saved to /tmp/homepage-full.png');
  
  // Take individual section screenshots
  const sectionIds = ['hero', 'difference', 'testimonial', 'award', 'faq', 'pricing'];
  for (const id of sectionIds) {
    const el = await page.$(`#${id}, section[id="${id}"]`);
    if (el) {
      await el.screenshot({ path: `/tmp/section-${id}.png` });
      console.log(`Section ${id} screenshot saved`);
    }
  }
  
  await browser.close();
})();
