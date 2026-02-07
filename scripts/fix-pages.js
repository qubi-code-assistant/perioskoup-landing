#!/usr/bin/env node
/**
 * Fix all pages for consistency:
 * 1. Inject navbar HTML (replace placeholder)
 * 2. Update theme to navy/lime
 * 3. Fix fonts to Gabarito + Dongle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Pages to fix (excluding homepage)
const PAGES = [
  'calculator.html',
  'privacy.html',
  'terms.html',
  'contact.html',
  'signup.html',
  'periochamp.html',
];

// The navbar HTML template
const NAVBAR_HTML = `
    <!-- Navbar -->
    <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between h-16 md:h-20">
                <a href="/" class="flex items-center gap-2 md:gap-3">
                    <img src="/logo-brand.svg" alt="Perioskoup Logo" class="h-8 md:h-10 w-auto">
                </a>
                <div class="hidden md:flex items-center gap-1">
                    <a href="/#how-it-works" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">How It Works</a>
                    <a href="/#award" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Award</a>
                    <a href="/#faq" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">FAQ</a>
                    <a href="/#pricing" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Pricing</a>
                    <a href="/blog/" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Blog</a>
                    <a href="/calculator.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">ROI Calculator</a>
                    <a href="/contact.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Contact</a>
                </div>
                <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden p-2 text-white/80 hover:text-white">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
        <div id="mobile-menu" class="hidden md:hidden border-t border-white/10" style="background: rgba(35, 73, 102, 0.98);">
            <div class="px-4 py-4 space-y-1">
                <a href="/#how-it-works" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">How It Works</a>
                <a href="/#award" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Award</a>
                <a href="/#faq" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">FAQ</a>
                <a href="/#pricing" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Pricing</a>
                <a href="/blog/" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Blog</a>
                <a href="/calculator.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">ROI Calculator</a>
                <a href="/contact.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Contact</a>
            </div>
        </div>
    </nav>
`;

// New Tailwind config with navy/lime theme
const NEW_TAILWIND_CONFIG = `
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: {
                            900: '#050c11',
                            800: '#0a171e',
                            700: '#12222d',
                            600: '#1d3449',
                            500: '#234966',
                        },
                        lime: {
                            700: '#6faa29',
                            600: '#8ad33d',
                            500: '#c0e57a',
                            400: '#e0ffab',
                        },
                        // Keep old names as aliases for compatibility
                        nebula: '#1D3449',
                        mint: '#8AD33D',
                        aqua: '#8AD33D',
                        pale: '#c0e57a',
                        rice: '#e0ffab',
                    },
                    fontFamily: {
                        heading: ['Dongle', 'sans-serif'],
                        sans: ['Gabarito', 'sans-serif'],
                    },
                }
            }
        }
    </script>`;

// Correct Google Fonts link
const CORRECT_FONTS_LINK = `<link href="https://fonts.googleapis.com/css2?family=Dongle:wght@300;400;700&family=Gabarito:wght@400;500;600;700&display=swap" rel="stylesheet">`;

function fixPage(filePath) {
  console.log(`Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // 1. Replace navbar placeholder with actual navbar
  content = content.replace(
    /<!-- Shared Navbar \(injected by main\.js\) -->\s*<div id="navbar-placeholder"><\/div>/g,
    NAVBAR_HTML
  );
  
  // Also handle case where placeholder is already removed but no navbar
  if (!content.includes('<nav id="navbar"') && !content.includes('<nav ')) {
    // Insert navbar after <body...>
    content = content.replace(
      /(<body[^>]*>)/,
      `$1${NAVBAR_HTML}`
    );
  }
  
  // 2. Replace old Tailwind config with new one
  content = content.replace(
    /<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*<\/script>/g,
    NEW_TAILWIND_CONFIG
  );
  
  // 3. Fix font links - replace Nunito with Gabarito+Dongle
  content = content.replace(
    /<link[^>]*fonts\.googleapis\.com[^>]*Nunito[^>]*>/g,
    CORRECT_FONTS_LINK
  );
  
  // Also ensure Dongle+Gabarito is present if only one of them
  if (!content.includes('family=Dongle') || !content.includes('family=Gabarito')) {
    content = content.replace(
      /<link[^>]*fonts\.googleapis\.com[^>]*family=[^>]*>/g,
      CORRECT_FONTS_LINK
    );
  }
  
  // 4. Add navbar scroll effect script if not present
  if (!content.includes('nav.nav-scrolled') && !content.includes('nav-scrolled')) {
    content = content.replace(
      '</head>',
      `    <style>
        nav.nav-scrolled { background-color: rgba(18, 34, 45, 0.95); backdrop-filter: blur(20px); }
    </style>
</head>`
    );
  }
  
  // 5. Add scroll listener script before </body> if navbar exists
  if (content.includes('<nav id="navbar"') && !content.includes('addEventListener(\'scroll\'')) {
    content = content.replace(
      '</body>',
      `    <script>
        window.addEventListener('scroll', function() {
            var navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
            }
        });
    </script>
</body>`
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Fixed`);
    return true;
  } else {
    console.log(`  - No changes needed`);
    return false;
  }
}

// Main
console.log('Fixing pages for navbar and theme consistency...\n');

let fixedCount = 0;

for (const page of PAGES) {
  const filePath = path.join(rootDir, page);
  if (fs.existsSync(filePath)) {
    if (fixPage(filePath)) {
      fixedCount++;
    }
  } else {
    console.log(`  ⚠ File not found: ${page}`);
  }
}

console.log(`\nDone! Fixed ${fixedCount} pages.`);
