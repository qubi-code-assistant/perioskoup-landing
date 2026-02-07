#!/usr/bin/env node
/**
 * Add SEO elements to all pages:
 * 1. Breadcrumbs
 * 2. Canonical tags
 * 3. Twitter cards
 * 4. Missing schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Page configurations
const PAGES = {
  'contact.html': {
    title: 'Contact',
    canonical: 'https://perioskoup.com/contact',
    description: 'Get in touch with Perioskoup. Questions about our AI dental companion? We\'d love to hear from you.',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }],
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Perioskoup",
      "description": "Contact page for Perioskoup AI Dental Companion",
      "url": "https://perioskoup.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "Perioskoup",
        "url": "https://perioskoup.com"
      }
    }
  },
  'signup.html': {
    title: 'Apply as Founding Dentist',
    canonical: 'https://perioskoup.com/signup',
    description: 'Join the PerioChampion founding cohort. 3 months free to trial Perioskoup with your perio patients.',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Apply', url: '/signup' }],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Apply as a PerioChampion Founding Dentist",
      "description": "Application page for dental practices to join Perioskoup's founding program",
      "url": "https://perioskoup.com/signup"
    }
  },
  'periochamp.html': {
    title: 'PerioChamp Demo',
    canonical: 'https://perioskoup.com/periochamp',
    description: 'Watch how Perioskoup keeps perio patients on track and saves you 10-15 minutes per recall.',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Demo', url: '/periochamp' }],
    schema: {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Perioskoup Demo - Cut 10-15 Minutes Per Perio Recall",
      "description": "Watch Dr. Anca Laura Constantin demonstrate how Perioskoup helps dental practices save time",
      "uploadDate": "2025-12-01",
      "thumbnailUrl": "https://perioskoup.com/og-image.png"
    }
  },
  'calculator.html': {
    title: 'ROI Calculator',
    canonical: 'https://perioskoup.com/calculator',
    description: 'Calculate how much patient no-shows and relapses cost your dental practice.',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'ROI Calculator', url: '/calculator' }],
    hasSchema: true // Already has schema
  },
  'privacy.html': {
    title: 'Privacy Policy',
    canonical: 'https://perioskoup.com/privacy',
    description: 'How Perioskoup protects your data. GDPR compliant AI dental companion privacy policy.',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy' }]
  },
  'terms.html': {
    title: 'Terms of Service',
    canonical: 'https://perioskoup.com/terms',
    description: 'Terms of service for Perioskoup AI dental companion app.',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Terms of Service', url: '/terms' }]
  }
};

// Blog pages
const BLOG_PAGES = {
  'blog/index.html': {
    title: 'Blog',
    canonical: 'https://perioskoup.com/blog/',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog/' }]
  },
  'blog/best-ai-dental-companion-2025.html': {
    title: 'Best AI Dental Companion Apps 2025',
    canonical: 'https://perioskoup.com/blog/best-ai-dental-companion-2025',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog/' }, { name: 'Best AI Dental Companions 2025', url: '/blog/best-ai-dental-companion-2025' }]
  },
  'blog/dental-practice-ai-assistant-guide.html': {
    title: 'Dental Practice AI Assistants Guide',
    canonical: 'https://perioskoup.com/blog/dental-practice-ai-assistant-guide',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog/' }, { name: 'AI Assistants Guide', url: '/blog/dental-practice-ai-assistant-guide' }]
  },
  'blog/patient-compliance-dental-apps.html': {
    title: 'Patient Compliance Apps',
    canonical: 'https://perioskoup.com/blog/patient-compliance-dental-apps',
    breadcrumb: [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog/' }, { name: 'Patient Compliance Apps', url: '/blog/patient-compliance-dental-apps' }]
  }
};

function generateBreadcrumbHTML(items) {
  const schemaItems = items.map((item, index) => `
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="flex items-center">
      ${index > 0 ? '<svg class="w-3 h-3 mx-2 text-white/30" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' : ''}
      ${index < items.length - 1 
        ? `<a itemprop="item" href="${item.url}" class="text-white/50 hover:text-white/70 transition-colors"><span itemprop="name">${item.name}</span></a>`
        : `<span itemprop="name" class="text-white/70">${item.name}</span>`
      }
      <meta itemprop="position" content="${index + 1}" />
    </li>`).join('');

  return `
    <!-- Breadcrumbs -->
    <nav aria-label="Breadcrumb" class="max-w-7xl mx-auto px-6 pt-20 md:pt-24">
      <ol itemscope itemtype="https://schema.org/BreadcrumbList" class="flex flex-wrap items-center text-xs md:text-sm">
        ${schemaItems}
      </ol>
    </nav>`;
}

function generateTwitterCards(config) {
  return `
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@perioskoup">
    <meta name="twitter:title" content="${config.title} | Perioskoup">
    <meta name="twitter:description" content="${config.description}">
    <meta name="twitter:image" content="https://perioskoup.com/og-image.png">`;
}

function addSEOToPage(filePath, config) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // 1. Add canonical if missing
  if (!content.includes('rel="canonical"') && config.canonical) {
    content = content.replace(
      '</head>',
      `    <link rel="canonical" href="${config.canonical}">\n</head>`
    );
    modified = true;
    console.log('  + Added canonical tag');
  }

  // 2. Add Twitter cards if missing
  if (!content.includes('twitter:card') && config.description) {
    const twitterTags = generateTwitterCards(config);
    content = content.replace(
      '</head>',
      `${twitterTags}\n</head>`
    );
    modified = true;
    console.log('  + Added Twitter cards');
  }

  // 3. Add schema if provided and missing
  if (config.schema && !config.hasSchema && !content.includes(config.schema['@type'])) {
    const schemaScript = `
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(config.schema, null, 4)}
    </script>`;
    content = content.replace(
      '</head>',
      `${schemaScript}\n</head>`
    );
    modified = true;
    console.log('  + Added schema');
  }

  // 4. Add breadcrumbs if missing (after </nav> closing tag, before <main>)
  if (config.breadcrumb && !content.includes('aria-label="Breadcrumb"')) {
    const breadcrumbHTML = generateBreadcrumbHTML(config.breadcrumb);
    
    // Find the closing </nav> tag and insert after it
    // But we need to be careful - the nav ends and then main/section starts
    // Insert breadcrumbs right after the nav closing tag
    const navEndMatch = content.match(/<\/nav>\s*\n/g);
    if (navEndMatch && navEndMatch.length > 0) {
      // Find the last </nav> (the mobile menu one)
      const lastNavEnd = content.lastIndexOf('</nav>');
      if (lastNavEnd !== -1) {
        // Find where <main or <section starts after nav
        const afterNav = content.substring(lastNavEnd);
        const mainMatch = afterNav.match(/(<main|<section)/);
        
        if (mainMatch) {
          const insertPoint = lastNavEnd + afterNav.indexOf(mainMatch[0]);
          content = content.substring(0, insertPoint) + breadcrumbHTML + '\n\n    ' + content.substring(insertPoint);
          modified = true;
          console.log('  + Added breadcrumbs');
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('  ✓ Saved');
  } else {
    console.log('  - No changes needed');
  }

  return modified;
}

// Main
console.log('Adding SEO elements to pages...\n');

let totalModified = 0;

// Process regular pages
for (const [filename, config] of Object.entries(PAGES)) {
  const filePath = path.join(rootDir, filename);
  if (fs.existsSync(filePath)) {
    if (addSEOToPage(filePath, config)) totalModified++;
  }
}

// Process blog pages
for (const [filename, config] of Object.entries(BLOG_PAGES)) {
  const filePath = path.join(rootDir, filename);
  if (fs.existsSync(filePath)) {
    if (addSEOToPage(filePath, config)) totalModified++;
  }
}

console.log(`\nDone! Modified ${totalModified} pages.`);
