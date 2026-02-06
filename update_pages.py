import os
import re
import json
import html
from html.parser import HTMLParser

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.html = []
        self.navbar_added = False
        self.footer_added = False

    def handle_starttag(self, tag, attrs):
        # Convert attrs to a dict
        attrs_dict = dict(attrs)
        
        # Background style for body
        if tag == 'body':
            attrs_dict['style'] = "background: linear-gradient(180deg, #234966 0%, #12222d 50%, #0a171e 100%); color: white;"
            attrs = list(attrs_dict.items())

        # Navbar replacement
        if tag == 'nav' and attrs_dict.get('id') == 'navbar':
            self.navbar_added = True
            return

        # Footer replacement
        if tag == 'footer':
            self.footer_added = True
            return
        
        # Replace color classes
        if 'class' in attrs_dict:
            classes = attrs_dict['class'].split()
            new_classes = [
                'text-white' if cls == 'text-nebula' else
                'text-white/70' if cls == 'text-nebula/70' else
                'bg-white/5' if cls == 'bg-white' else
                'border-white/10' if cls == 'border-white/5' else
                cls for cls in classes
            ]
            attrs_dict['class'] = ' '.join(new_classes)
            attrs = list(attrs_dict.items())

        # Reconstruct the tag
        attr_str = ' '.join(f'{k}="{html.escape(str(v))}"' for k, v in attrs)
        full_tag = f'<{tag} {attr_str}>' if attrs else f'<{tag}>'
        self.html.append(full_tag)

    def handle_endtag(self, tag):
        # Insert navbar right after body start
        if not self.navbar_added and tag == 'body':
            navbar_html = '''
            <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div class="max-w-7xl mx-auto px-4 md:px-6">
                    <div class="flex items-center justify-between h-16 md:h-20">
                        <!-- Logo -->
                        <a href="/" class="flex items-center gap-2 md:gap-3 group">
                            <img src="/logo-brand.svg" alt="Perioskoup Logo" class="h-8 md:h-10 w-auto">
                        </a>

                        <!-- Navigation Links -->
                        <div class="hidden md:flex items-center gap-1">
                            <a href="/#how-it-works" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">How It Works</a>
                            <a href="/#award" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Award</a>
                            <a href="/#faq" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">FAQ</a>
                            <a href="/blog/" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Blog</a>
                            <a href="/calculator.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">ROI Calculator</a>
                            <a href="/contact.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Contact</a>
                        </div>

                        <!-- Mobile Menu Button -->
                        <button onclick="toggleMobileMenu()" class="md:hidden p-2 -mr-2 text-white/80 hover:text-white transition-colors" aria-label="Toggle menu">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden md:hidden border-t border-white/10" style="background: rgba(35, 73, 102, 0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                    <div class="px-4 py-4 space-y-1">
                        <a href="#how-it-works" onclick="closeMobileMenu()" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">How It Works</a>
                        <a href="#award" onclick="closeMobileMenu()" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Award</a>
                        <a href="#faq" onclick="closeMobileMenu()" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">FAQ</a>
                        <a href="/blog/" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Blog</a>
                        <a href="/calculator.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">ROI Calculator</a>
                        <a href="/contact.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Contact</a>
                    </div>
                </div>
            </nav>
            '''
            self.html.append(navbar_html)
            self.navbar_added = True

        # Insert footer right before body end
        if not self.footer_added and tag == 'body':
            footer_html = '''
            <footer class="bg-navy-900 text-white py-16 border-t border-white/10">
                <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                    <!-- Column 1: Logo & Description -->
                    <div class="md:col-span-1">
                        <img src="/logo-brand.svg" alt="Perioskoup Logo" class="h-10 mb-4">
                        <p class="text-white/70 text-sm">AI dental companion that strengthens patient-clinician relationships.</p>
                    </div>

                    <!-- Column 2: Product -->
                    <div class="md:col-span-1">
                        <h4 class="font-semibold mb-4 text-white/80">Product</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="/#how-it-works" class="text-white/70 hover:text-white transition-colors">How It Works</a></li>
                            <li><a href="/#features" class="text-white/70 hover:text-white transition-colors">Features</a></li>
                            <li><a href="/calculator.html" class="text-white/70 hover:text-white transition-colors">ROI Calculator</a></li>
                            <li><a href="/#award" class="text-white/70 hover:text-white transition-colors">EFP Award</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Resources -->
                    <div class="md:col-span-1">
                        <h4 class="font-semibold mb-4 text-white/80">Resources</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="/blog/" class="text-white/70 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="/#faq" class="text-white/70 hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="/privacy.html" class="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms.html" class="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <!-- Column 4: Contact -->
                    <div class="md:col-span-1">
                        <h4 class="font-semibold mb-4 text-white/80">Contact</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="/contact.html" class="text-white/70 hover:text-white transition-colors">Get Support</a></li>
                            <li><a href="#" class="text-white/70 hover:text-white transition-colors">hello@perioskoup.com</a></li>
                            <li class="flex items-center gap-2">
                                <a href="https://www.instagram.com/perioskoup" target="_blank" class="text-white/70 hover:text-white transition-colors">Instagram</a>
                                <a href="https://www.linkedin.com/company/perioskoup" target="_blank" class="text-white/70 hover:text-white transition-colors">LinkedIn</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mt-8 text-center text-sm text-white/50 border-t border-white/10 pt-8">
                    © 2024 Perioskoup. All Rights Reserved.
                </div>
            </footer>
            '''
            self.html.append(footer_html)
            self.footer_added = True

        # Add meta tags for canonical and Open Graph if in head
        if tag == 'head':
            meta_tags = f'''
            <link rel="canonical" href="https://perioskoup.com/" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://perioskoup.com/" />
            <meta property="og:title" content="Perioskoup - Award-Winning AI Dental Companion" />
            <meta property="og:description" content="EFP Innovation Award 2025 Winner. Your AI dental companion that strengthens patient-clinician relationships." />
            <meta property="og:image" content="https://perioskoup.com/og-image.png" />
            <meta property="og:site_name" content="Perioskoup" />
            '''
            self.html.append(meta_tags)

        self.html.append(f'</{tag}>')

    def handle_data(self, data):
        self.html.append(data)

    def handle_comment(self, data):
        self.html.append(f'<!--{data}-->')

    def handle_decl(self, decl):
        self.html.append(f'<!{decl}>')

    def handle_pi(self, data):
        self.html.append(f'<?{data}>')

    def get_html(self):
        return ''.join(self.html)

def add_article_metadata(file_path):
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add article structured data
    article_script = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Perioskoup Blog Article",
        "description": "Article about dental care and technology",
        "author": {
            "@type": "Person",
            "name": "Dr. Anca Constantin"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Perioskoup",
            "logo": {
                "@type": "ImageObject",
                "url": "https://perioskoup.com/logo.png"
            }
        },
        "datePublished": "2024-01-01"
    }

    # Create script tag
    script_tag = f'<script type="application/ld+json">{json.dumps(article_script, indent=2)}</script>'

    # Insert script in head if head exists
    if '</head>' in content:
        content = content.replace('</head>', f'{script_tag}\n</head>')
    else:
        # If no head, add it
        content = f'<!DOCTYPE html>\n<html>\n<head>\n{script_tag}\n</head>\n<body>{content}</body>\n</html>'

    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def update_page(file_path, is_blog_article=False):
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Initialize parser
    parser = PageParser()
    parser.feed(content)
    updated_content = parser.get_html()

    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    # Add article metadata if it's a blog article
    if is_blog_article:
        add_article_metadata(file_path)

# Pages to update
pages = [
    ('calculator.html', False), 
    ('privacy.html', False),
    ('terms.html', False), 
    ('periochamp.html', False), 
    ('signup.html', False),
    ('blog/index.html', False),
    ('blog/best-ai-dental-companion-2025.html', True),
    ('blog/dental-practice-ai-assistant-guide.html', True),
    ('blog/patient-compliance-dental-apps.html', True)
]

base_path = '/root/.openclaw/workspace/perioskoup/landing_doctor/perioskoup_landing_doctor/'

# Update pages
for page, is_blog_article in pages:
    file_path = os.path.join(base_path, page)
    print(f"Updating {page}...")
    
    try:
        update_page(file_path, is_blog_article)
        print(f"Successfully updated {page}")
    except Exception as e:
        print(f"Error updating {page}: {e}")

print("All pages updated.")