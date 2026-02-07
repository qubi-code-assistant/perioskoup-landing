#!/usr/bin/env python3
import glob
import re

# Full footer from homepage (adapted for subpages - links adjusted)
FULL_FOOTER = '''<footer class="relative z-10 text-white">
        <div class="max-w-7xl mx-auto px-6">
            <!-- Main Footer Content -->
            <div class="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                <!-- Brand Column -->
                <div class="lg:col-span-1">
                    <a href="/" class="flex items-center gap-3 mb-5">
                        <img src="/logo-brand.svg" alt="Perioskoup Logo" class="h-10 w-auto">
                    </a>
                    <p class="text-white/60 text-sm leading-relaxed mb-5">
                        Award-winning AI dental companion that keeps patients connected between visits.
                    </p>
                    <!-- Social Links -->
                    <div class="flex gap-3">
                        <a href="https://www.linkedin.com/company/perioskoup" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/10 transition-all" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"></path></svg>
                        </a>
                        <a href="https://www.instagram.com/perioskoup" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/10 transition-all" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008"></path></svg>
                        </a>
                        <a href="https://x.com/perioskoup" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/10 transition-all" aria-label="X (Twitter)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z"></path></svg>
                        </a>
                    </div>
                </div>

                <!-- Product Column -->
                <div>
                    <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
                    <ul class="space-y-2.5">
                        <li><a href="/features.html" class="text-white/60 hover:text-lime-400 text-sm transition-colors">Features</a></li>
                        <li><a href="/calculator.html" class="text-white/60 hover:text-lime-400 text-sm transition-colors">ROI Calculator</a></li>
                        <li><a href="/blog/" class="text-white/60 hover:text-lime-400 text-sm transition-colors">Blog</a></li>
                    </ul>
                </div>

                <!-- Company Column -->
                <div>
                    <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
                    <ul class="space-y-2.5">
                        <li><a href="/about.html" class="text-white/60 hover:text-lime-400 text-sm transition-colors">About Us</a></li>
                        <li><a href="/contact.html" class="text-white/60 hover:text-lime-400 text-sm transition-colors">Contact</a></li>
                        <li><a href="/privacy.html" class="text-white/60 hover:text-lime-400 text-sm transition-colors">Privacy Policy</a></li>
                        <li><a href="/terms.html" class="text-white/60 hover:text-lime-400 text-sm transition-colors">Terms of Service</a></li>
                    </ul>
                </div>

                <!-- CTA Column -->
                <div>
                    <a href="/signup.html" class="block w-full py-3 rounded-full text-white text-center font-medium text-sm transition-all hover:shadow-lg hover:shadow-lime-500/30 mb-4" style="background: linear-gradient(135deg, #8ad33d 0%, #6faa29 100%);">
                        Get Early Access
                    </a>
                    <p class="text-white/40 text-xs text-center">Free for founding clinics</p>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="py-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
                <p class="text-white/50 text-sm">© 2026 Perioskoup. All rights reserved.</p>
                <p class="text-white/40 text-xs">AI Dental Companion for Modern Dentistry</p>
            </div>
        </div>
    </footer>'''

# Simple footer pattern to replace
SIMPLE_FOOTER_PATTERN = r'<footer class="py-8[^"]*"[^>]*>.*?</footer>'

# Files to update (not homepage)
html_files = glob.glob('*.html') + glob.glob('blog/*.html')

for filepath in html_files:
    if filepath == 'index.html':
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace simple footer with full footer
    content = re.sub(SIMPLE_FOOTER_PATTERN, FULL_FOOTER, content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated footer: {filepath}")

# Now tighten homepage spacing
with open('index.html', 'r') as f:
    homepage = f.read()

# Reduce section padding
homepage = homepage.replace('py-24 lg:py-32', 'py-16 lg:py-20')
homepage = homepage.replace('mb-20 scroll-item', 'mb-12 scroll-item')
homepage = homepage.replace('py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4', 'py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4')

with open('index.html', 'w') as f:
    f.write(homepage)

print("\n✅ Tightened homepage spacing")
print("✅ Standardized footer across all pages")
