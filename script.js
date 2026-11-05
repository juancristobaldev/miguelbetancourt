/**
 * ELECTROGAFITER - Miguel Ángel Betancourt
 * Native Vanilla ES6+ Interactive Controller
 * Zero Framework Dependencies
 */

(function () {
  'use strict';

  // --- CONFIGURATION & CONSTANTS ---
  const PHONE_NUMBER = "56972978114";
  const PHONE_DISPLAY = "+56 9 7297 8114";
  const EMAIL = "miguelangelbetancourtbarra@gmail.com";
  const REGION = "IX Región de La Araucanía, Chile";

  /**
   * Centralized WhatsApp link dispatch
   * @param {string} message - Unencoded message string
   */
  window.openWhatsApp = function (message) {
    if (!message) return;
    const encodedMessage = encodeURIComponent(message.trim());
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initWhatsAppTriggers();
    initContactForm();
    initSmoothScroll();
    initLightbox();
  });

  /**
   * 1. Header Sticky and Scroll State
   */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on page load
  }

  /**
   * 2. Mobile Hamburger Navigation
   */
  function initMobileMenu() {
    const header = document.querySelector('.header');
    const toggleBtn = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileCtaBtn = document.querySelector('.mobile-nav-cta .btn');

    if (!header || !toggleBtn) return;

    const openMenu = () => {
      header.classList.add('mobile-open');
      document.body.classList.add('menu-open');
      if (mobileNav) mobileNav.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      header.classList.remove('mobile-open');
      document.body.classList.remove('menu-open');
      if (mobileNav) mobileNav.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
      const isOpen = header.classList.contains('mobile-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking mobile nav links
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    if (mobileCtaBtn) {
      mobileCtaBtn.addEventListener('click', () => {
        closeMenu();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('mobile-open')) {
        closeMenu();
      }
    });

    // Close when resizing beyond tablet breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && header.classList.contains('mobile-open')) {
        closeMenu();
      }
    }, { passive: true });
  }

  /**
   * 3. Intersection Observer Scroll Reveal
   */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const delay = target.getAttribute('data-delay') || '0';
            target.style.transitionDelay = `${delay}ms`;
            target.classList.add('is-visible');
            observer.unobserve(target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
      }
    );

    reveals.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /**
   * 4. WhatsApp Event Delegation for Interactive Elements
   */
  function initWhatsAppTriggers() {
    // Delegated click handler for any element carrying data-whatsapp
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-whatsapp]');
      if (trigger) {
        const message = trigger.getAttribute('data-whatsapp');
        if (message) {
          e.preventDefault();
          window.openWhatsApp(message);
        }
      }
    });
  }

  /**
   * 5. Contact Form Submission
   */
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const phoneInput = document.getElementById('form-phone');
      const serviceInput = document.getElementById('form-service');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : 'Construcción General';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !phone || !message) {
        alert('Por favor complete todos los campos requeridos.');
        return;
      }

      const formattedMessage = `Hola Miguel Ángel, mi nombre es ${name}. Me interesa cotizar el servicio de ${service}. \n\nDetalles del proyecto: ${message}\n\nMi teléfono es: ${phone}`;
      window.openWhatsApp(formattedMessage);
    });
  }

  /**
   * 6. Smooth Scrolling for Internal Links
   */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  }

  /**
   * 7. Professional Service Gallery Lightbox
   */
  function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    const backdrop = modal.querySelector('.lightbox-backdrop');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const imgEl = document.getElementById('lightbox-img');
    const categoryEl = document.getElementById('lightbox-category');
    const counterEl = document.getElementById('lightbox-counter');
    const captionEl = document.getElementById('lightbox-caption');
    const stageEl = modal.querySelector('.lightbox-stage');

    let currentGroup = '';
    let groupItems = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const updateSlide = (animate = false) => {
      if (!groupItems.length || currentIndex < 0 || currentIndex >= groupItems.length) return;
      const item = groupItems[currentIndex];

      if (animate && imgEl) {
        imgEl.classList.add('is-fading');
        setTimeout(() => {
          imgEl.src = item.src;
          imgEl.alt = item.caption || '';
          if (categoryEl) categoryEl.textContent = item.category || 'Galería Técnica';
          if (captionEl) captionEl.textContent = item.caption || '';
          if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${groupItems.length}`;
          imgEl.classList.remove('is-fading');
        }, 150);
      } else if (imgEl) {
        imgEl.src = item.src;
        imgEl.alt = item.caption || '';
        if (categoryEl) categoryEl.textContent = item.category || 'Galería Técnica';
        if (captionEl) captionEl.textContent = item.caption || '';
        if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${groupItems.length}`;
      }

      // Preload adjacent items
      if (groupItems.length > 1) {
        const nextIdx = (currentIndex + 1) % groupItems.length;
        const prevIdx = (currentIndex - 1 + groupItems.length) % groupItems.length;
        const preloadNext = new Image();
        preloadNext.src = groupItems[nextIdx].src;
        const preloadPrev = new Image();
        preloadPrev.src = groupItems[prevIdx].src;
      }
    };

    const openLightbox = (group, index = 0) => {
      const elements = Array.from(document.querySelectorAll(`[data-lightbox-group="${group}"]`));
      if (!elements.length) return;

      currentGroup = group;
      groupItems = elements.map(el => ({
        src: el.getAttribute('data-lightbox-src') || el.getAttribute('src') || '',
        caption: el.getAttribute('data-lightbox-caption') || el.getAttribute('alt') || '',
        category: el.getAttribute('data-lightbox-category') || 'ELECTROGAFITER'
      }));

      currentIndex = Math.max(0, Math.min(index, groupItems.length - 1));
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');

      updateSlide(false);
    };

    const closeLightbox = () => {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      if (imgEl) {
        imgEl.src = '';
      }
    };

    const prevSlide = () => {
      if (!groupItems.length) return;
      currentIndex = (currentIndex - 1 + groupItems.length) % groupItems.length;
      updateSlide(true);
    };

    const nextSlide = () => {
      if (!groupItems.length) return;
      currentIndex = (currentIndex + 1) % groupItems.length;
      updateSlide(true);
    };

    // Click trigger listener
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox-group]');
      if (!trigger) return;

      // Do not trigger if clicking an inner button
      if (e.target.closest('button, a') && !trigger.classList.contains('lightbox-trigger')) {
        return;
      }

      e.preventDefault();
      const group = trigger.getAttribute('data-lightbox-group');
      const elements = Array.from(document.querySelectorAll(`[data-lightbox-group="${group}"]`));
      const idx = elements.indexOf(trigger);
      openLightbox(group, idx >= 0 ? idx : 0);
    });

    // Control buttons
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Touch Swipe Navigation for mobile
    if (stageEl) {
      stageEl.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      stageEl.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = e.changedTouches[0].clientY - touchStartY;

          // Check if predominantly horizontal swipe
          if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 70) {
            if (deltaX < 0) {
              nextSlide(); // Swiped left -> next
            } else {
              prevSlide(); // Swiped right -> prev
            }
          }
        }
      }, { passive: true });
    }
  }
})();
