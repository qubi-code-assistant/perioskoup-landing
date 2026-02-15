// Standalone navbar initializer for sub-pages that don't use main.js
(function() {
  function injectNavbar() {
    var el = document.getElementById('navbar-placeholder');
    if (!el) return;
    el.outerHTML = '<nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">' +
      '<div class="max-w-7xl mx-auto px-6">' +
        '<div class="flex items-center justify-between h-16 md:h-20">' +
          '<a href="/" class="flex items-center gap-2 md:gap-3">' +
            '<img src="/logo-brand.svg" alt="Perioskoup Logo" class="h-8 md:h-10 w-auto">' +
          '</a>' +
          '<div class="hidden md:flex items-center gap-1">' +
            '<a href="/about.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">About</a>' +
            '<a href="/features.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Features</a>' +
            '<a href="/calculator.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">ROI Calculator</a>' +
            '<a href="/blog/" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Blog</a>' +
            '<a href="/contact.html" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all">Contact</a>' +
          '</div>' +
          '<button onclick="document.getElementById(\'mobile-menu\').classList.toggle(\'hidden\')" class="md:hidden p-2 text-white/80 hover:text-white">' +
            '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div id="mobile-menu" class="hidden md:hidden border-t border-white/10" style="background:rgba(35,73,102,0.98);">' +
        '<div class="px-4 py-4 space-y-1">' +
          '<a href="/about.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">About</a>' +
          '<a href="/features.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Features</a>' +
          '<a href="/calculator.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">ROI Calculator</a>' +
          '<a href="/blog/" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Blog</a>' +
          '<a href="/contact.html" class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Contact</a>' +
        '</div>' +
      '</div>' +
    '</nav>';

    window.addEventListener('scroll', function() {
      var nav = document.getElementById('navbar');
      if (nav) nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavbar);
  } else {
    injectNavbar();
  }
})();
