#!/usr/bin/env python3
import re
import glob

# New desktop nav (no How It Works)
new_desktop_nav = '''<div class="hidden md:flex items-center gap-1">
                    <a href="/features.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Features</a>
                    <a href="/about.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">About</a>
                    <a href="/blog/" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Blog</a>
                    <a href="/contact.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Contact</a>
                </div>'''

# New mobile nav
new_mobile_nav = '''<div class="px-4 py-4 space-y-1">
                <a href="/features.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Features</a>
                <a href="/about.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">About</a>
                <a href="/blog/" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Blog</a>
                <a href="/contact.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Contact</a>
            </div>'''

# Pattern for desktop nav
desktop_pattern = r'<div class="hidden md:flex items-center gap-1">.*?</div>'
# Pattern for mobile nav  
mobile_pattern = r'<div class="px-4 py-4 space-y-1">.*?</div>\s*</div>\s*</nav>'

html_files = glob.glob('*.html') + glob.glob('blog/*.html')

for filepath in html_files:
    if filepath == 'pricing.html':
        continue  # Skip pricing
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace desktop nav
    content = re.sub(desktop_pattern, new_desktop_nav, content, flags=re.DOTALL)
    
    # Replace mobile nav (need to preserve closing tags)
    mobile_replacement = new_mobile_nav + '\n        </div>\n    </nav>'
    content = re.sub(mobile_pattern, mobile_replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated: {filepath}")

print("\nNav updated across all pages!")
