#!/usr/bin/env python3
import re
import os

# Pages to update
pages = [
    "calculator.html",
    "privacy.html",
    "terms.html", 
    "periochamp.html",
    "signup.html",
    "blog/best-ai-dental-companion-2025.html",
    "blog/dental-practice-ai-assistant-guide.html", 
    "blog/patient-compliance-dental-apps.html"
]

# Read the template HTML
with open('blog/index.html', 'r') as f:
    template_html = f.read()

# Extract specific components
navbar_match = re.search(r'<nav id="navbar".*?</nav>\s*</div>\s*<div id="mobile-menu".*?</div>', template_html, re.DOTALL)
footer_match = re.search(r'<footer.*?</footer>', template_html, re.DOTALL)
navbar_script_match = re.search(r'<script>\s*// Navbar scroll effect.*?</script>', template_html, re.DOTALL)

navbar = navbar_match.group(0) if navbar_match else ''
footer = footer_match.group(0) if footer_match else ''
navbar_script = navbar_script_match.group(0) if navbar_script_match else ''

# Process each page
for page_path in pages:
    full_path = os.path.join(os.getcwd(), page_path)
    
    try:
        with open(full_path, 'r') as f:
            page_content = f.read()
        
        # Modify body tag to add gradient background
        page_content = re.sub(r'<body([^>]*)>', r'<body\1 style="background: linear-gradient(180deg, #234966 0%, #12222d 50%, #0a171e 100%);">', page_content)
        
        # Remove existing navbar
        page_content = re.sub(r'<nav.*?</nav>\s*</div>\s*(?=<|<div id="mobile-menu")', '', page_content, flags=re.DOTALL)
        
        # Remove existing footer
        page_content = re.sub(r'<footer.*?</footer>', '', page_content, flags=re.DOTALL)
        
        # Insert new navbar after body tag
        page_content = re.sub(r'<body[^>]*>', r'\g<0>\n' + navbar, page_content)
        
        # Insert new footer before </body> tag 
        page_content = re.sub(r'</body>', f'{footer}\n\n{navbar_script}\n\n</body>', page_content)
        
        # Replace text-nebula with text-white
        page_content = re.sub(r'text-nebula(-/60)?', r'text-white\1', page_content)
        
        # Replace bg-white or bg-rice with bg-white/5
        page_content = re.sub(r'(bg-white|bg-rice)', r'bg-white/5 border-white/10', page_content)
        
        # Write back to file
        with open(full_path, 'w') as f:
            f.write(page_content)
        
        print(f'Updated {page_path}')
    
    except Exception as e:
        print(f'Error processing {page_path}: {e}')

print('All pages updated successfully.')