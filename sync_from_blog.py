#!/usr/bin/env python3
"""
Sync navbar, styles, and body from blog/index.html to all pages.
"""
import re

# Read blog/index.html as the source of truth
with open('blog/index.html', 'r') as f:
    blog_html = f.read()

# Extract navbar (from <!-- Navbar --> to </nav>)
navbar_match = re.search(r'(<!-- Navbar -->.*?</nav>)', blog_html, re.DOTALL)
BLOG_NAVBAR = navbar_match.group(1) if navbar_match else None

# Extract nav-scrolled style
style_match = re.search(r'(nav\.nav-scrolled \{[^}]+\})', blog_html)
NAV_STYLE = style_match.group(1) if style_match else 'nav.nav-scrolled { background-color: rgba(18, 34, 45, 0.95); backdrop-filter: blur(20px); }'

# Extract body class
body_match = re.search(r'<body class="([^"]+)"', blog_html)
BODY_CLASS = body_match.group(1) if body_match else 'text-white min-h-screen font-sans'

# Scroll script
SCROLL_SCRIPT = '''
    <script>
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            document.getElementById('navbar').classList.toggle('nav-scrolled', window.scrollY > 50);
        });
    </script>'''

print(f"Blog navbar extracted: {len(BLOG_NAVBAR)} chars")
print(f"Body class: {BODY_CLASS}")
print(f"Nav style: {NAV_STYLE}")

# Pages to update
pages = [
    ('index.html', False),  # homepage: use # not /#
    ('calculator.html', True),
    ('contact.html', True),
    ('signup.html', True),
    ('privacy.html', True),
    ('terms.html', True),
    ('periochamp.html', True),
]

def update_page(filepath, use_root_anchors):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Create navbar with correct anchor prefix
    navbar = BLOG_NAVBAR
    if not use_root_anchors:
        # Homepage: change /#anchor to #anchor
        navbar = navbar.replace('href="/#', 'href="#')
    
    # Remove existing navbar (various patterns)
    content = re.sub(r'<!-- Navbar -->.*?</nav>', '', content, flags=re.DOTALL)
    content = re.sub(r'<nav id="navbar"[^>]*>.*?</nav>', '', content, flags=re.DOTALL)
    
    # Update body class
    content = re.sub(r'<body class="[^"]*"', f'<body class="{BODY_CLASS}"', content)
    
    # Add nav-scrolled style if not present
    if 'nav.nav-scrolled' not in content:
        content = re.sub(r'(</head>)', f'    <style>\n        {NAV_STYLE}\n    </style>\n\\1', content)
    
    # Insert navbar after <body...>
    content = re.sub(r'(<body[^>]*>)', f'\\1\n\n    {navbar}\n', content)
    
    # Add scroll script if not present
    if 'Navbar scroll effect' not in content:
        content = re.sub(r'(</body>)', f'{SCROLL_SCRIPT}\n\\1', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✓ Updated {filepath}")

for page, use_root in pages:
    try:
        update_page(page, use_root)
    except Exception as e:
        print(f"✗ Error with {page}: {e}")

print("\nDone! Run 'npm run build' and deploy.")
