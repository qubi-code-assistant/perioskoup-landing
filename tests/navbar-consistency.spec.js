// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://perioskouplandingdoctor.vercel.app';

// All pages to test (excluding homepage)
const PAGES = [
  { path: '/calculator.html', name: 'Calculator' },
  { path: '/privacy.html', name: 'Privacy' },
  { path: '/terms.html', name: 'Terms' },
  { path: '/contact.html', name: 'Contact' },
  { path: '/signup.html', name: 'Signup' },
  { path: '/periochamp.html', name: 'PerioChamp' },
  { path: '/blog/', name: 'Blog Index' },
  { path: '/blog/patient-compliance-dental-apps.html', name: 'Blog Post 1' },
  { path: '/blog/best-ai-dental-companion-2025.html', name: 'Blog Post 2' },
  { path: '/blog/dental-practice-ai-assistant-guide.html', name: 'Blog Post 3' },
];

// Expected styles for consistency
const EXPECTED_FONT = 'Gabarito';
const EXPECTED_HEADING_FONT = 'Dongle';

// Navy/Lime theme colors
const THEME_COLORS = {
  navy900: '#050c11',
  navy800: '#0a171e',
  navy700: '#12222d',
  navy600: '#1d3449',
  navy500: '#234966',
  lime700: '#6faa29',
  lime600: '#8ad33d',
  lime500: '#c0e57a',
  lime400: '#e0ffab',
};

test.describe('Navbar Consistency Tests', () => {
  for (const page of PAGES) {
    test(`${page.name}: has navbar with correct structure`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      // Check navbar exists
      const navbar = p.locator('nav').first();
      await expect(navbar).toBeVisible();
      
      // Check logo exists and links to homepage
      const logoLink = navbar.locator('a[href="/"], a[href="./"], a[href="../"]').first();
      await expect(logoLink).toBeVisible();
      
      // Check logo image
      const logoImg = logoLink.locator('img');
      await expect(logoImg).toHaveAttribute('src', /logo/i);
    });

    test(`${page.name}: has correct nav links`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const navbar = p.locator('nav').first();
      
      // Desktop nav links (hidden on mobile)
      const desktopNav = navbar.locator('.hidden.md\\:flex, div.md\\:flex').first();
      
      // Check key links exist
      const expectedLinks = ['How It Works', 'Award', 'FAQ', 'Pricing', 'Blog'];
      for (const linkText of expectedLinks) {
        const link = desktopNav.locator(`a:has-text("${linkText}")`);
        await expect(link).toBeVisible();
      }
    });

    test(`${page.name}: uses Gabarito font`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      // Check body font
      const bodyFont = await p.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).fontFamily;
      });
      
      expect(bodyFont.toLowerCase()).toContain('gabarito');
      expect(bodyFont.toLowerCase()).not.toContain('nunito');
      expect(bodyFont.toLowerCase()).not.toContain('inter');
    });

    test(`${page.name}: has mobile menu button`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const navbar = p.locator('nav').first();
      
      // Mobile menu button (visible only on mobile)
      const mobileMenuBtn = navbar.locator('button.md\\:hidden, button[class*="md:hidden"]');
      await expect(mobileMenuBtn).toBeAttached();
    });

    test(`${page.name}: navbar has correct height`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const navbar = p.locator('nav').first();
      const navbarBox = await navbar.boundingBox();
      
      // Navbar should be between 64-80px (h-16 to h-20)
      expect(navbarBox?.height).toBeGreaterThanOrEqual(60);
      expect(navbarBox?.height).toBeLessThanOrEqual(90);
    });
  }
});

test.describe('Theme Consistency Tests', () => {
  for (const page of PAGES) {
    test(`${page.name}: has navy/lime theme colors in config`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      // Check Tailwind config has navy/lime colors
      const hasNavyLime = await p.evaluate(() => {
        // @ts-ignore
        const config = window.tailwind?.config;
        if (!config) return false;
        
        const colors = config.theme?.extend?.colors || {};
        return (colors.navy || colors.lime);
      });
      
      expect(hasNavyLime).toBeTruthy();
    });

    test(`${page.name}: has correct background gradient`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const bgStyle = await p.evaluate(() => {
        return document.body.style.background || 
               window.getComputedStyle(document.body).background;
      });
      
      // Should have gradient with navy colors
      expect(bgStyle).toMatch(/linear-gradient|#234966|#12222d|#0a171e/i);
    });
  }
});

test.describe('Layout & Spacing Tests', () => {
  for (const page of PAGES) {
    test(`${page.name}: main content has proper padding`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const main = p.locator('main').first();
      
      if (await main.isVisible()) {
        const paddingTop = await main.evaluate(el => 
          parseInt(window.getComputedStyle(el).paddingTop)
        );
        
        // Main should have padding-top > 60px (for fixed navbar)
        expect(paddingTop).toBeGreaterThanOrEqual(60);
      }
    });

    test(`${page.name}: no horizontal overflow`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const hasOverflow = await p.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasOverflow).toBeFalsy();
    });

    test(`${page.name}: footer exists`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      const footer = p.locator('footer');
      await expect(footer).toBeVisible();
    });
  }
});

test.describe('Responsive Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  for (const page of PAGES) {
    test(`${page.name}: mobile layout works`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      
      // Navbar should be visible
      const navbar = p.locator('nav').first();
      await expect(navbar).toBeVisible();
      
      // Mobile menu button should be visible
      const mobileMenuBtn = navbar.locator('button').first();
      await expect(mobileMenuBtn).toBeVisible();
      
      // Desktop nav should be hidden
      const desktopNav = navbar.locator('.hidden.md\\:flex').first();
      await expect(desktopNav).not.toBeVisible();
    });
  }
});
