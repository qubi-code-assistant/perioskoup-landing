#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# Remove the large decorative blur circles that cause weird backlights
patterns_to_remove = [
    # Transformation section blurs
    r'<div class="absolute top-1/2 left-0 w-\[500px\][^>]+blur-\[120px\][^>]+pointer-events-none"></div>\n?',
    r'<div class="absolute top-1/2 right-0 w-\[500px\][^>]+blur-\[120px\][^>]+pointer-events-none"></div>\n?',
    # Award section blurs  
    r'<div class="absolute top-0 left-0 w-\[500px\][^>]+blur-3xl[^>]+pointer-events-none"></div>\n?',
    r'<div class="absolute bottom-0 right-0 w-\[400px\][^>]+blur-3xl[^>]+pointer-events-none"></div>\n?',
    # Security section pulse blur
    r'<div class="absolute inset-0 bg-mint/20 blur-3xl rounded-full animate-pulse"></div>\n?',
]

for pattern in patterns_to_remove:
    matches = re.findall(pattern, content)
    if matches:
        print(f"Removing: {pattern[:50]}... ({len(matches)} found)")
    content = re.sub(pattern, '', content)

# Also remove small blur decorations in comparison cards
content = re.sub(
    r'<div class="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl[^>]+></div>\n?',
    '',
    content
)
print("Removed small card blur decorations")

with open('index.html', 'w') as f:
    f.write(content)

print("\n✅ Removed decorative blur elements")
