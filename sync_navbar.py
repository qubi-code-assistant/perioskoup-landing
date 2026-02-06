#!/usr/bin/env python3
"""
Sync the navbar from blog/index.html to all pages.
For homepage: uses #anchor format
For other pages: uses /#anchor format
"""
import re
import os

# The navbar template (from blog/index.html, uses /#anchor format)
NAVBAR_TEMPLATE = '''    <!-- Navbar -->
    <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <div class="flex items-center justify-between h-16 md:h-20">
                <a href="/" class="flex items-center gap-2 md:gap-3">
                    <img src="/logo-brand.svg" alt="Perioskoup Logo" class="h-8 md:h-10 w-auto">
                </a>
                <div class="hidden md:flex items-center gap-1">
                    <a href="ANCHOR_PREFIX#how-it-works" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">How It Works</a>
                    <a href="ANCHOR_PREFIX#award" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Award</a>
                    <a href="ANCHOR_PREFIX#faq" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">FAQ</a>
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
                <a href="ANCHOR_PREFIX#how-it-works" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">How It Works</a>
                <a href="ANCHOR_PREFIX#award" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Award</a>
                <a href="ANCHOR_PREFIX#faq" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">FAQ</a>
                <a href="/blog/" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Blog</a>
                <a href="/calculator.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">ROI Calculator</a>
                <a href="/contact.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Contact</a>
            </div>
        </div>
    </nav>'''

# Pages to update (all except blog/index.html which is the source)
pages = [
    ("index.html", ""),  # Homepage uses # (empty prefix)
    ("calculator.html", "/"),
    ("privacy.html", "/"),
    ("terms.html", "/"),
    ("periochamp.html", "/"),
    ("signup.html", "/"),
    ("contact.html", "/"),
    ("blog/best-ai-dental-companion-2025.html", "/"),
    ("blog/dental-practice-ai-assistant-guide.html", "/"),
    ("blog/patient-compliance-dental-apps.html", "/"),
    ("blog/index.html", "/"),
]

def update_page(page_path, anchor_prefix):
    """Update navbar in a page."""
    try:
        with open(page_path, 'r') as f:
            content = f.read()
        
        # Create navbar with correct anchor prefix
        navbar = NAVBAR_TEMPLATE.replace('ANCHOR_PREFIX', anchor_prefix)
        
        # Remove existing navbar (including mobile menu)
        # Pattern to match from <nav to the closing </div> of mobile-menu
        navbar_pattern = r'<!-- @navbar -->\s*<nav.*?</nav>|<!-- Navbar -->\s*<nav.*?</nav>|<nav[^>]*id="navbar"[^>]*>.*?</nav>\s*</div>\s*</div>\s*</nav>|<nav[^>]*class="fixed[^>]*>.*?</nav>'
        content = re.sub(navbar_pattern, '', content, flags=re.DOTALL)
        
        # Also remove any orphaned mobile-menu divs
        content = re.sub(r'\s*<div id="mobile-menu".*?</div>\s*</div>\s*</nav>', '', content, flags=re.DOTALL)
        
        # Find body tag and insert navbar after it
        body_match = re.search(r'<body[^>]*>', content)
        if body_match:
            insert_pos = body_match.end()
            content = content[:insert_pos] + '\n\n' + navbar + '\n' + content[insert_pos:]
        
        with open(page_path, 'w') as f:
            f.write(content)
        
        print(f'✓ Updated {page_path}')
        return True
    except Exception as e:
        print(f'✗ Error updating {page_path}: {e}')
        return False

# Run updates
os.chdir(os.path.dirname(os.path.abspath(__file__)))
success = 0
for page_path, prefix in pages:
    if update_page(page_path, prefix):
        success += 1

print(f'\n{success}/{len(pages)} pages updated.')
