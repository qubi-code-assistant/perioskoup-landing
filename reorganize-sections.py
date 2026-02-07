#!/usr/bin/env python3
"""
Reorganize homepage sections for better storytelling:
1. Hero (keep first)
2. See the Difference (transformation)
3. Award (move up, merge testimonial)
4. Security (move before FAQ)
5. FAQ
6. Pricing
7. Final CTA

Also fix gradient flow for smooth transition.
"""
import re

with open('index.html', 'r') as f:
    content = f.read()

# Define section markers and extract each section
sections = {}

# Extract each section using regex
patterns = {
    'hero': r'(<!-- @hero -->.*?)(?=<!-- @transformation -->)',
    'transformation': r'(<!-- @transformation -->.*?)(?=<!-- @testimonial -->)',
    'testimonial': r'(<!-- @testimonial -->.*?)(?=<!-- @award -->)',
    'award': r'(<!-- @award -->.*?)(?=<!-- @security -->)',
    'security': r'(<!-- @security -->.*?)(?=<!-- @faq -->)',
    'faq': r'(<!-- @faq -->.*?)(?=<!-- @pricing-beta -->)',
    'pricing': r'(<!-- @pricing-beta -->.*?)(?=<!-- @final-cta -->)',
    'final_cta': r'(<!-- @final-cta -->.*?)(?=<!-- @signup-modal -->)',
}

for name, pattern in patterns.items():
    match = re.search(pattern, content, re.DOTALL)
    if match:
        sections[name] = match.group(1)
        print(f"Extracted: {name} ({len(match.group(1))} chars)")
    else:
        print(f"WARNING: Could not extract {name}")

# Get the parts before hero and after final_cta
before_hero = content.split('<!-- @hero -->')[0]
after_final_cta = content.split('<!-- @signup-modal -->')[1]
signup_modal_onwards = '<!-- @signup-modal -->' + after_final_cta

# New gradient colors for smooth flow
gradients = {
    'hero': 'background: linear-gradient(180deg, #234966 0%, #12222d 100%);',
    'transformation': 'background: linear-gradient(180deg, #12222d 0%, #0a171e 100%);',
    'award': 'background: linear-gradient(180deg, #0a171e 0%, #0f1f2a 50%, #0a171e 100%);',  # slight highlight
    'security': 'background: linear-gradient(180deg, #0a171e 0%, #050c11 100%);',
    'faq': 'background: linear-gradient(180deg, #050c11 0%, #0a171e 100%);',
    'pricing': 'background: linear-gradient(180deg, #0a171e 0%, #050c11 100%);',
    'final_cta': 'background: linear-gradient(180deg, #050c11 0%, #0a171e 50%, #12222d 100%);',
}

# Update gradients in each section
def update_gradient(section_content, new_gradient):
    # Match style="background: linear-gradient..." pattern
    pattern = r'style="background:\s*linear-gradient\([^"]+\)"'
    # Only replace the first occurrence (the section's main style)
    return re.sub(pattern, f'style="{new_gradient}"', section_content, count=1)

for name, gradient in gradients.items():
    if name in sections:
        sections[name] = update_gradient(sections[name], gradient)
        print(f"Updated gradient for {name}")

# Reassemble in new order (removing testimonial, it's merged into award)
new_order = [
    'hero',
    'transformation', 
    'award',          # Moved up (already has founder quote)
    'security',       # Moved before FAQ
    'faq',
    'pricing',
    'final_cta'
]

# Build new content
new_content = before_hero
for section_name in new_order:
    if section_name in sections:
        new_content += sections[section_name]
        print(f"Added section: {section_name}")

new_content += signup_modal_onwards

# Write the new file
with open('index.html', 'w') as f:
    f.write(new_content)

print("\n✅ Sections reorganized successfully!")
print("New order: Hero → Transformation → Award → Security → FAQ → Pricing → Final CTA")
print("Testimonial section removed (redundant with Award's founder quote)")
