import './style.css';
import { animate, inView, stagger } from 'motion';

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  // Remove no-js class if present
  document.documentElement.classList.remove('no-js');

  // Wait for lucide to load and create icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize all interactive features
  initNavScrollEffect();
  initHeroAnimation();
  initSectionReveals();
  initFlashlightEffect();
  initCounterAnimation();
  initConnectorLine();
  initOrbParallax();
  initSmoothScroll();
  initFormHandler();
  initModal();
});

// ========================================
// NAV SCROLL EFFECT
// ========================================
function initNavScrollEffect() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const scrollThreshold = 100;

  const updateNav = () => {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  // Use passive listener for performance
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // Initial check
}

// ========================================
// HERO ANIMATION SEQUENCE
// ========================================
function initHeroAnimation() {
  const badge = document.querySelector('.hero-badge');
  const headline = document.querySelector('.hero-headline');
  const subhead = document.querySelector('.hero-subhead');
  const cta = document.querySelector('.hero-cta');
  const phone = document.querySelector('.hero-phone-container');

  // If reduced motion, show everything immediately
  if (prefersReducedMotion) {
    [badge, headline, subhead, cta, phone].forEach(el => {
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      }
    });
    return;
  }

  // Orchestrated hero entrance with Motion One
  // Each animation adds .js-animated class on completion to prevent flicker
  if (badge) {
    animate(badge,
      { opacity: [0, 1], y: [20, 0], filter: ['blur(8px)', 'blur(0px)'] },
      { duration: 0.6, easing: [0.16, 1, 0.3, 1], delay: 0.1 }
    ).finished.then(() => badge.classList.add('js-animated'));
  }

  if (headline) {
    animate(headline,
      { opacity: [0, 1], y: [30, 0], filter: ['blur(8px)', 'blur(0px)'] },
      { duration: 0.7, easing: [0.16, 1, 0.3, 1], delay: 0.2 }
    ).finished.then(() => headline.classList.add('js-animated'));
  }

  if (subhead) {
    animate(subhead,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.6, easing: [0.16, 1, 0.3, 1], delay: 0.35 }
    ).finished.then(() => subhead.classList.add('js-animated'));
  }

  if (cta) {
    animate(cta,
      { opacity: [0, 1], scale: [0.95, 1] },
      { duration: 0.5, easing: [0.34, 1.56, 0.64, 1], delay: 0.5 }
    ).finished.then(() => cta.classList.add('js-animated'));
  }

  if (phone) {
    animate(phone,
      { opacity: [0, 1], y: [40, 0], scale: [0.95, 1] },
      { duration: 1, easing: [0.16, 1, 0.3, 1], delay: 0.4 }
    ).finished.then(() => phone.classList.add('js-animated'));
  }
}

// ========================================
// SECTION REVEAL SYSTEM
// ========================================
function initSectionReveals() {
  const sections = document.querySelectorAll('.scroll-item');

  if (prefersReducedMotion) {
    sections.forEach(section => {
      section.classList.add('in-view');
      section.style.opacity = '1';
      section.style.transform = 'none';
      section.style.filter = 'none';
    });
    return;
  }

  sections.forEach((section) => {
    // Skip hero elements (they have their own animation)
    const parentSection = section.closest('section');
    if (parentSection && parentSection.classList.contains('min-h-screen')) {
      // Make hero scroll-items visible immediately
      section.classList.add('in-view');
      return;
    }

    inView(section, (info) => {
      const target = info?.target || section;
      if (!target || !target.classList) return;

      // Get delay from class
      const delayClass = [...target.classList].find(c => c.startsWith('delay-'));
      const delay = delayClass ? parseInt(delayClass.replace('delay-', '')) / 1000 : 0;

      animate(target,
        {
          opacity: [0, 1],
          y: [30, 0],
          scale: [0.98, 1],
          filter: ['blur(4px)', 'blur(0px)']
        },
        {
          duration: 0.7,
          easing: [0.16, 1, 0.3, 1],
          delay
        }
      ).finished.then(() => {
        if (target.classList) {
          target.classList.add('in-view');
        }
      });
    }, { amount: 0.15 });
  });
}

// ========================================
// FLASHLIGHT/GLOW EFFECT
// ========================================
function initFlashlightEffect() {
  const cards = document.querySelectorAll('.glow-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Expose for inline handlers
window.handleMouseMove = function(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);
};

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');

  if (prefersReducedMotion) {
    return; // Keep static numbers
  }

  counters.forEach(counter => {
    const originalText = counter.textContent.trim();

    // Parse range like "15-20%" or single value like "80%"
    const rangeMatch = originalText.match(/^(\d+)-(\d+)(.*)$/);
    const singleMatch = originalText.match(/^(\d+)(.*)$/);

    let startNum, endNum, suffix;

    if (rangeMatch) {
      startNum = parseInt(rangeMatch[1]);
      endNum = parseInt(rangeMatch[2]);
      suffix = rangeMatch[3] || '';
    } else if (singleMatch) {
      startNum = null;
      endNum = parseInt(singleMatch[1]);
      suffix = singleMatch[2] || '';
    } else {
      return; // Can't parse
    }

    // Flag to prevent re-triggering
    let hasAnimated = false;

    inView(counter, () => {
      if (hasAnimated) return;
      hasAnimated = true;

      const duration = 1500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out expo for smoother feel
        const easedProgress = 1 - Math.pow(1 - progress, 4);

        if (startNum !== null) {
          // Range animation (e.g., 15-20%)
          const currentStart = Math.round(startNum * easedProgress);
          const currentEnd = Math.round(endNum * easedProgress);
          counter.textContent = `${currentStart}-${currentEnd}${suffix}`;
        } else {
          // Single number animation (e.g., 80%)
          const currentValue = Math.round(endNum * easedProgress);
          counter.textContent = `${currentValue}${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    }, { amount: 0.3 });
  });
}

// ========================================
// CONNECTOR LINE ANIMATION (How It Works)
// ========================================
function initConnectorLine() {
  const line = document.querySelector('.connector-line');
  if (!line || prefersReducedMotion) return;

  inView(line, () => {
    setTimeout(() => {
      line.classList.add('animate');
    }, 300);
  }, { amount: 0.3 });
}

// ========================================
// ORB PARALLAX EFFECT
// ========================================
function initOrbParallax() {
  if (prefersReducedMotion) return;

  const orbs = document.querySelectorAll('.gradient-orb, .gradient-orb-2');
  if (!orbs.length) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  const factor = 0.015;
  const smoothing = 0.08;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * factor;
    mouseY = (e.clientY - window.innerHeight / 2) * factor;
  });

  function updateOrbs() {
    currentX += (mouseX - currentX) * smoothing;
    currentY += (mouseY - currentY) * smoothing;

    orbs.forEach((orb, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const currentTransform = getComputedStyle(orb).transform;
      // Only apply parallax offset, preserve existing animations
      orb.style.setProperty('--parallax-x', `${currentX * direction}px`);
      orb.style.setProperty('--parallax-y', `${currentY * direction}px`);
    });

    requestAnimationFrame(updateOrbs);
  }

  updateOrbs();
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });
}

// ========================================
// FORM SUBMISSION HANDLER
// ========================================
function initFormHandler() {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  // Get form values
  const data = {
    name: formData.get('name'),
    practice: formData.get('practice'),
    email: formData.get('email'),
    country: formData.get('country'),
    chairs: formData.get('chairs'),
    biggest_issue: formData.get('biggest_issue'),
    message: formData.get('message') || ''
  };

  // Show loading state
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <span class="relative flex items-center gap-2">
      <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Joining...
    </span>
  `;
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xrbgpvge', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showSuccessState(form);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showErrorState(submitBtn, originalHTML);
  }
}

function showSuccessState(form) {
  const successContent = `
    <div class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-mint/20 flex items-center justify-center">
        <svg class="w-8 h-8 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-white mb-2">You're on the list!</h3>
      <p class="text-pale/80 mb-4">We'll be in touch soon with your early access details.</p>
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
        <span class="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
        <span class="text-pale text-sm">Thanks for joining!</span>
      </div>
    </div>
  `;

  if (!prefersReducedMotion) {
    animate(form, { opacity: [1, 0] }, { duration: 0.2 }).finished.then(() => {
      form.innerHTML = successContent;
      animate(form, { opacity: [0, 1] }, { duration: 0.3 });
    });
  } else {
    form.innerHTML = successContent;
  }

  // Auto-close modal after 3 seconds
  setTimeout(() => {
    closeModal();
  }, 3000);
}

function showErrorState(submitBtn, originalHTML) {
  submitBtn.innerHTML = `
    <span class="relative flex items-center gap-2 text-red-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      Something went wrong
    </span>
  `;
  submitBtn.disabled = false;

  setTimeout(() => {
    submitBtn.innerHTML = originalHTML;
  }, 3000);
}

window.handleFormSubmit = handleFormSubmit;

// ========================================
// MODAL FUNCTIONS
// ========================================
function initModal() {
  const modal = document.getElementById('signup-modal');
  if (!modal) return;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal() {
  const modal = document.getElementById('signup-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal-backdrop');
  const content = modal.querySelector('.modal-content');

  modal.classList.remove('hidden');
  modal.offsetHeight; // Force reflow

  if (prefersReducedMotion) {
    modal.classList.add('active');
  } else {
    modal.classList.add('active');

    animate(backdrop,
      { opacity: [0, 1] },
      { duration: 0.3 }
    );

    animate(content,
      {
        opacity: [0, 1],
        scale: [0.9, 1]
      },
      {
        duration: 0.35,
        easing: [0.34, 1.56, 0.64, 1],
        delay: 0.05
      }
    );
  }

  document.body.classList.add('modal-open');

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }, prefersReducedMotion ? 0 : 350);
}

function closeModal() {
  const modal = document.getElementById('signup-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal-backdrop');
  const content = modal.querySelector('.modal-content');

  if (prefersReducedMotion) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    return;
  }

  animate(content,
    { opacity: [1, 0], scale: [1, 0.98] },
    { duration: 0.2, easing: [0.65, 0, 0.35, 1] }
  );

  animate(backdrop,
    { opacity: [1, 0] },
    { duration: 0.25, delay: 0.05 }
  ).finished.then(() => {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });
}

// Expose modal functions globally
window.openModal = openModal;
window.closeModal = closeModal;

// ========================================
// RECOMMEND MODAL FUNCTIONS
// ========================================
function openRecommendModal() {
  const modal = document.getElementById('recommend-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal-backdrop');
  const content = modal.querySelector('.modal-content');

  modal.classList.remove('hidden');
  modal.offsetHeight; // Force reflow

  if (prefersReducedMotion) {
    modal.classList.add('active');
  } else {
    modal.classList.add('active');

    animate(backdrop,
      { opacity: [0, 1] },
      { duration: 0.3 }
    );

    animate(content,
      {
        opacity: [0, 1],
        scale: [0.9, 1]
      },
      {
        duration: 0.35,
        easing: [0.34, 1.56, 0.64, 1],
        delay: 0.05
      }
    );
  }

  document.body.classList.add('modal-open');

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }, prefersReducedMotion ? 0 : 350);
}

function closeRecommendModal() {
  const modal = document.getElementById('recommend-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal-backdrop');
  const content = modal.querySelector('.modal-content');

  if (prefersReducedMotion) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    return;
  }

  animate(content,
    { opacity: [1, 0], scale: [1, 0.98] },
    { duration: 0.2, easing: [0.65, 0, 0.35, 1] }
  );

  animate(backdrop,
    { opacity: [1, 0] },
    { duration: 0.25, delay: 0.05 }
  ).finished.then(() => {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });
}

// Expose recommend modal functions globally
window.openRecommendModal = openRecommendModal;
window.closeRecommendModal = closeRecommendModal;

// ========================================
// MOBILE MENU FUNCTIONS
// ========================================
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;

  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    if (!prefersReducedMotion) {
      animate(menu,
        { opacity: [0, 1], y: [-10, 0] },
        { duration: 0.2, easing: [0.16, 1, 0.3, 1] }
      );
    }
  } else {
    if (!prefersReducedMotion) {
      animate(menu,
        { opacity: [1, 0], y: [0, -10] },
        { duration: 0.15 }
      ).finished.then(() => {
        menu.classList.add('hidden');
      });
    } else {
      menu.classList.add('hidden');
    }
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu || menu.classList.contains('hidden')) return;

  if (!prefersReducedMotion) {
    animate(menu,
      { opacity: [1, 0], y: [0, -10] },
      { duration: 0.15 }
    ).finished.then(() => {
      menu.classList.add('hidden');
    });
  } else {
    menu.classList.add('hidden');
  }
}

// Expose mobile menu functions globally
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// Initialize recommend form handler
document.addEventListener('DOMContentLoaded', () => {
  const recommendForm = document.getElementById('recommend-form');
  if (recommendForm) {
    recommendForm.addEventListener('submit', handleRecommendFormSubmit);
  }

  // Also handle ESC key for recommend modal
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('recommend-modal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeRecommendModal();
    }
  });
});

async function handleRecommendFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  const data = {
    patient_name: formData.get('patient_name'),
    patient_email: formData.get('patient_email'),
    dentist_name: formData.get('dentist_name'),
    dentist_practice: formData.get('dentist_practice') || '',
    dentist_email: formData.get('dentist_email') || '',
    recommend_reason: formData.get('recommend_reason') || '',
    type: 'patient_recommendation'
  };

  // Show loading state
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <span class="relative flex items-center gap-2">
      <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Sending...
    </span>
  `;
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xrbgpvge', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showRecommendSuccessState(form);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showRecommendErrorState(submitBtn, originalHTML);
  }
}

function showRecommendSuccessState(form) {
  const successContent = `
    <div class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-mint/20 flex items-center justify-center">
        <svg class="w-8 h-8 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-white mb-2">Thank you!</h3>
      <p class="text-pale/80 mb-4">We'll reach out to your dentist and let them know about Perioskoup.</p>
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
        <span class="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
        <span class="text-pale text-sm">Recommendation sent!</span>
      </div>
    </div>
  `;

  if (!prefersReducedMotion) {
    animate(form, { opacity: [1, 0] }, { duration: 0.2 }).finished.then(() => {
      form.innerHTML = successContent;
      animate(form, { opacity: [0, 1] }, { duration: 0.3 });
    });
  } else {
    form.innerHTML = successContent;
  }

  // Auto-close modal after 3 seconds
  setTimeout(() => {
    closeRecommendModal();
  }, 3000);
}

function showRecommendErrorState(submitBtn, originalHTML) {
  submitBtn.innerHTML = `
    <span class="relative flex items-center gap-2 text-red-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      Something went wrong
    </span>
  `;
  submitBtn.disabled = false;

  setTimeout(() => {
    submitBtn.innerHTML = originalHTML;
  }, 3000);
}
