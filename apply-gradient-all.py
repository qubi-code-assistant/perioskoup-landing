#!/usr/bin/env python3
import glob
import re

# The clean gradient from homepage
BODY_GRADIENT = 'background: linear-gradient(180deg, #234966 0%, #1a3a4f 8%, #12222d 15%, #0a171e 30%, #050c11 50%, #050c11 70%, #0a171e 85%, #12222d 100%);'

html_files = glob.glob('*.html') + glob.glob('blog/*.html')

for filepath in html_files:
    if filepath == 'index.html':
        continue  # Already done
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Update body gradient
    content = re.sub(
        r'<body[^>]*style="background:[^"]*"[^>]*>',
        f'<body class="text-white min-h-screen font-sans" style="{BODY_GRADIENT}">',
        content
    )
    
    # Also handle body without style
    if 'style="background:' not in content and '<body' in content:
        content = re.sub(
            r'<body([^>]*)>',
            f'<body\\1 style="{BODY_GRADIENT}">',
            content
        )
    
    # Remove section-level background gradients
    content = re.sub(
        r'(<section[^>]*) style="background:\s*linear-gradient\([^"]+\)"',
        r'\1',
        content
    )
    
    # Remove decorative blur elements
    blur_patterns = [
        r'<div class="absolute[^>]+blur-\[\d+px\][^>]+pointer-events-none"></div>\n?',
        r'<div class="absolute[^>]+blur-3xl[^>]+pointer-events-none"></div>\n?',
    ]
    for pattern in blur_patterns:
        content = re.sub(pattern, '', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated: {filepath}")

print("\n✅ Applied gradient to all pages")
