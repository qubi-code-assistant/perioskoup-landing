#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# Set body to have smooth full-page gradient
content = re.sub(
    r'<body class="text-white min-h-screen font-sans" style="background:[^"]+">',
    '<body class="text-white min-h-screen font-sans" style="background: linear-gradient(180deg, #234966 0%, #1a3a4f 8%, #12222d 15%, #0a171e 30%, #050c11 50%, #050c11 70%, #0a171e 85%, #12222d 100%);">',
    content
)

# Remove section-level gradients (keep structure, remove inline style backgrounds)
# Hero section - keep the gradient for above-the-fold look
# Everything else - transparent or inherit

sections_to_clear = [
    (r'(<section id="how-it-works"[^>]*) style="background:[^"]+"', r'\1'),
    (r'(<section id="award"[^>]*) style="background:[^"]+"', r'\1'),
    (r'(<section class="py-20"[^>]*) style="background:[^"]+"', r'\1'),  # security
    (r'(<section id="faq"[^>]*) style="background:[^"]+"', r'\1'),
    (r'(<section id="pricing"[^>]*) style="background:[^"]+"', r'\1'),
    (r'(<section class="py-24 relative overflow-hidden"[^>]*) style="background:[^"]+"', r'\1'),  # final-cta
    (r'(<footer[^>]*) style="background:[^"]+"', r'\1'),
]

for pattern, replacement in sections_to_clear:
    content = re.sub(pattern, replacement, content)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Fixed gradient - single smooth body gradient, removed section gradients")
