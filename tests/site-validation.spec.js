import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/periochamp.html', name: 'PerioChamp VSL' },
  { path: '/signup.html', name: 'Signup' },
  { path: '/privacy.html', name: 'Privacy' },
  { path: '/terms.html', name: 'Terms' },
  { path: '/calculator.html', name: 'Calculator' },
  { path: '/blog/', name: 'Blog Index' },
  { path: '/blog/best-ai-dental-companion-2025.html', name: 'Blog: AI Companion' },
  { path: '/blog/patient-compliance-dental-apps.html', name: 'Blog: Compliance' },
  { path: '/blog/dental-practice-ai-assistant-guide.html', name: 'Blog: AI Assistant' },
];

test.describe('Site Validation', () => {

  test('All pages return 200 status', async ({ page }) => {
    const errors = [];

    for (const { path, name } of PAGES) {
      const response = await page.goto(`${BASE_URL}${path}`);
      const status = response?.status();

      if (status !== 200) {
        errors.push(`${name} (${path}): Status ${status}`);
      }
    }

    if (errors.length > 0) {
      console.log('404 Errors found:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

    expect(errors).toHaveLength(0);
  });

  test('No console errors on any page', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`${msg.text()}`);
      }
    });

    for (const { path, name } of PAGES) {
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForLoadState('networkidle');
    }

    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(e => console.log(`  - ${e}`));
    }

    expect(consoleErrors).toHaveLength(0);
  });

  test('All pages have meta title', async ({ page }) => {
    const errors = [];

    for (const { path, name } of PAGES) {
      await page.goto(`${BASE_URL}${path}`);
      const title = await page.title();

      if (!title || title.length < 10) {
        errors.push(`${name}: Missing or short title "${title}"`);
      }
    }

    if (errors.length > 0) {
      console.log('Title errors:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

    expect(errors).toHaveLength(0);
  });

  test('All pages have meta description', async ({ page }) => {
    const errors = [];

    for (const { path, name } of PAGES) {
      await page.goto(`${BASE_URL}${path}`);
      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

      if (!metaDesc || metaDesc.length < 50) {
        errors.push(`${name}: Missing or short meta description`);
      }
    }

    if (errors.length > 0) {
      console.log('Meta description errors:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

    expect(errors).toHaveLength(0);
  });

  test('All internal links work', async ({ page }) => {
    const brokenLinks = [];

    await page.goto(`${BASE_URL}/`);

    const links = await page.locator('a[href^="/"]').all();
    const hrefs = new Set();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        hrefs.add(href);
      }
    }

    for (const href of hrefs) {
      try {
        const response = await page.goto(`${BASE_URL}${href}`);
        if (response?.status() === 404) {
          brokenLinks.push(href);
        }
      } catch (e) {
        brokenLinks.push(`${href} (error: ${e.message})`);
      }
    }

    if (brokenLinks.length > 0) {
      console.log('Broken links:');
      brokenLinks.forEach(l => console.log(`  - ${l}`));
    }

    expect(brokenLinks).toHaveLength(0);
  });

  test('All images load', async ({ page }) => {
    const brokenImages = [];

    for (const { path, name } of PAGES) {
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForLoadState('networkidle');

      // Scroll to bottom to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);

      const images = await page.locator('img').all();

      for (const img of images) {
        const src = await img.getAttribute('src');
        if (!src || src.startsWith('data:')) continue;

        // Scroll image into view to trigger lazy loading
        await img.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        // Check if image is complete (loaded successfully)
        const isComplete = await img.evaluate(el => el.complete && el.naturalHeight > 0);

        if (!isComplete) {
          brokenImages.push(`${name}: ${src}`);
        }
      }
    }

    if (brokenImages.length > 0) {
      console.log('Broken images:');
      brokenImages.forEach(i => console.log(`  - ${i}`));
    }

    expect(brokenImages).toHaveLength(0);
  });

  test('Site is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`);

    // Check content is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('Open Graph tags present on main pages', async ({ page }) => {
    const errors = [];
    const mainPages = PAGES.slice(0, 5); // Test main pages

    for (const { path, name } of mainPages) {
      await page.goto(`${BASE_URL}${path}`);

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');

      if (!ogTitle) {
        errors.push(`${name}: Missing og:title`);
      }
      if (!ogDesc) {
        errors.push(`${name}: Missing og:description`);
      }
    }

    if (errors.length > 0) {
      console.log('Open Graph errors:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

    expect(errors).toHaveLength(0);
  });

});

test.describe('PerioChamp VSL Page', () => {

  test('All required elements are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/periochamp.html`);

    // Video placeholder
    await expect(page.getByTestId('vsl-video')).toBeVisible();

    // CTA buttons
    await expect(page.getByTestId('download-ios-top')).toBeVisible();
    await expect(page.getByTestId('download-android-top')).toBeVisible();

    // Q&A input (expand the Q&A section specifically)
    await page.locator('summary').filter({ hasText: 'Have another question?' }).click();
    await expect(page.getByTestId('qa-input')).toBeVisible();
  });

  test('Q&A section expands and shows input', async ({ page }) => {
    await page.goto(`${BASE_URL}/periochamp.html`);

    // Click to expand the Q&A section specifically
    await page.locator('summary').filter({ hasText: 'Have another question?' }).click();

    // Check input is visible
    await expect(page.getByTestId('qa-input')).toBeVisible();
  });

  test('CTA buttons are always enabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/periochamp.html`);

    const iosBtn = page.getByTestId('download-ios-top');
    const androidBtn = page.getByTestId('download-android-top');

    // Check enabled state (has gradient classes)
    await expect(iosBtn).toHaveClass(/from-mint/);
    await expect(androidBtn).toHaveClass(/from-mint/);
  });

  test('Page is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/periochamp.html`);

    // Check all elements are visible on mobile
    await expect(page.getByTestId('vsl-video')).toBeVisible();
    await expect(page.getByTestId('download-ios-top')).toBeVisible();

    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

});

test.describe('Signup Page', () => {

  test('All required form elements are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup.html`);

    // Form
    await expect(page.getByTestId('signup-form')).toBeVisible();

    // Key inputs
    await expect(page.getByTestId('input-name')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('select-role')).toBeVisible();
    await expect(page.getByTestId('input-practice')).toBeVisible();
    await expect(page.getByTestId('select-country')).toBeVisible();
    await expect(page.getByTestId('select-operatories')).toBeVisible();
    await expect(page.getByTestId('select-perio-patients')).toBeVisible();

    // Consent checkboxes
    await expect(page.getByTestId('consent-trial')).toBeVisible();
    await expect(page.getByTestId('consent-data')).toBeVisible();

    // Submit button
    await expect(page.getByTestId('submit-button')).toBeVisible();
  });

  test('Form validation works', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup.html`);

    // Try to submit empty form
    await page.getByTestId('submit-button').click();

    // Form should still be visible (not submitted)
    await expect(page.getByTestId('signup-form')).toBeVisible();
  });

  test('Page is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/signup.html`);

    // Check form is visible on mobile
    await expect(page.getByTestId('signup-form')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();

    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

});
