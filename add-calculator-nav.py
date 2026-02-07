#!/usr/bin/env python3
import glob
import re

html_files = glob.glob('*.html') + glob.glob('blog/*.html')

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Add calculator to desktop nav (after Features)
    content = re.sub(
        r'(<a href="/features\.html"[^>]+>Features</a>\s*)'
        r'(<a href="/about\.html")',
        r'\1<a href="/calculator.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">ROI Calculator</a>\n                    \2',
        content
    )
    
    # Add calculator to mobile nav (after Features)
    content = re.sub(
        r'(<a href="/features\.html"[^>]+rounded-lg">Features</a>\s*)'
        r'(<a href="/about\.html"[^>]+rounded-lg">)',
        r'\1<a href="/calculator.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">ROI Calculator</a>\n                \2',
        content
    )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated: {filepath}")

print("\n✅ Added Calculator to all navbars")
