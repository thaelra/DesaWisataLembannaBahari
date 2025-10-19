function initLayanan() {
  // initialize helpers (functions defined later in this file)
  try {
    initFloatingCards();
  } catch (e) { /* graceful */ }
  try { initParallax(); } catch (e) {}
  try { initScrollToTop(); } catch (e) {}
  try { initAnimations(); } catch (e) {}
  try { initTabs(); } catch (e) {}
  try { initScrollProgressBar(); } catch (e) {}
  try { initButtonRipple(); } catch (e) {}
  try { initFacilitiesToggle(); } catch (e) {}

  // Setup header + nav behavior and a single scroll listener
  const header = document.querySelector('.header');
  const navWrapper = document.querySelector('.nav-wrapper');
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const headerButtons = document.querySelector('.header-buttons');
  const media = window.matchMedia('(min-width: 1200px)');
  let lastScroll = 0;

  function onScroll() {
    const current = window.scrollY || window.pageYOffset;

    // sticky / shrink header
    if (header && navWrapper) {
      if (current > 60) {
        header.classList.add('small');
        navWrapper.classList.add('sticky');
      } else {
        header.classList.remove('small');
        navWrapper.classList.remove('sticky');
      }

      // hide nav when scrolling down, show when up
      if (current > lastScroll && current > 120) {
        navWrapper.classList.add('nav-hidden');
      } else {
        navWrapper.classList.remove('nav-hidden');
      }
    }

    // header buttons follow center on desktop is handled by IntersectionObserver (see below)

    lastScroll = Math.max(0, current);
  }

  // hamburger behavior
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // setup parallax (if header exists)
  const headerContainer = document.querySelector('.header-container') || header;
  if (headerContainer) {
    window.addEventListener('scroll', () => {
      const parallax = window.pageYOffset * 0.5;
      headerContainer.style.transform = `translateY(${parallax}px)`;
    }, { passive: true });
  }

  // info-card delay
  document.querySelectorAll('.info-card').forEach((card, index) => {
    card.style.setProperty('--delay', `${1 + index * 0.2}s`);
  });

  // Scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.id = 'scrollToTopBtn';
  scrollToTopBtn.title = 'Kembali ke atas';
  document.body.appendChild(scrollToTopBtn);
  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
  }, { passive: true });
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Intersection animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  });
  document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

  // Tab switching
  const switchTab = (tabName) => {
    document.querySelectorAll('.content-section').forEach((s) => s.classList.remove('active'));
    document.getElementById(`${tabName}-content`)?.classList.add('active');
    document.querySelectorAll('.header-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
  };
  // delegated click handler for header buttons (robust if DOM changes)
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest && ev.target.closest('.header-btn');
    if (!btn) return;
    // if it's a link or button, prevent default navigation
    ev.preventDefault();
    const tab = btn.dataset.tab;
    if (!tab) return;
    if (typeof window.switchTabAndSave === 'function') {
      window.switchTabAndSave(tab);
    } else {
      switchTab(tab);
    }
  }, { passive: false });
  switchTab('produk'); // default tab

  // hook scroll/resize
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  
  // ----- IntersectionObserver for header-follow (more efficient) -----
  try {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && header && headerButtons) {
      // create a sentinel at the header bottom by observing a zero-height element
      const sentinel = document.createElement('div');
      sentinel.style.position = 'absolute';
      sentinel.style.left = '0';
      sentinel.style.right = '0';
      sentinel.style.bottom = '0';
      sentinel.style.height = '1px';
      header.appendChild(sentinel);

      const observerOptions = {
        root: null,
        threshold: [0],
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // when sentinel is NOT intersecting, header scrolled past viewport -> float buttons
          if (!entry.isIntersecting && media.matches) {
            headerButtons.classList.add('follow');
            if (!prefersReduced) headerButtons.classList.add('floating');
          } else {
            headerButtons.classList.remove('follow', 'floating');
          }
        });
      }, observerOptions);

      io.observe(sentinel);
      // cleanup on unload
      window.addEventListener('unload', () => io.disconnect());
    }
  } catch (e) {
    // fallback: keep current behavior
    console.error(e);
  }

  // ----- Keyboard navigation for header buttons -----
  (function() {
    const btns = Array.from(document.querySelectorAll('.header-buttons .header-btn'));
    if (!btns.length) return;

    btns.forEach((b, i) => {
      b.setAttribute('tabindex', '0');
      b.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          btns[(i + 1) % btns.length].focus();
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          btns[(i - 1 + btns.length) % btns.length].focus();
        } else if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          b.click();
        }
      });
    });
  })();

  // ----- Remember last active tab (localStorage) -----
  (function() {
    const STORE_KEY = 'layanan:lastTab';
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) switchTab(saved);
    // override switchTab to persist
    const origSwitch = switchTab;
    window.switchTabAndSave = (tabName) => {
      origSwitch(tabName);
      try { localStorage.setItem(STORE_KEY, tabName); } catch (e) {}
    };
    // note: header button listeners are attached in the main registration block (avoids duplicates)
  })();

  // ----- Toast hint for first-time visitors (switch tabs hint) -----
  (function(){
    const TOAST_KEY = 'layanan:toastSeenV1';
    const toast = document.getElementById('layanan-toast');
    if (!toast) return;

    const dismissBtn = document.getElementById('layanan-toast-dismiss');
    const showFasilitasBtn = document.getElementById('layanan-toast-show-fasilitas');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showToast() {
      toast.hidden = false;
      // small delay so transition runs
      requestAnimationFrame(() => toast.classList.add('show'));
      // auto-dismiss after 6s if not reduced motion
      if (!prefersReduced) {
        setTimeout(hideToast, 6000);
      }
    }

    function hideToast() {
      toast.classList.remove('show');
      // keep it hidden after transition
      setTimeout(() => { toast.hidden = true; }, 300);
      try { localStorage.setItem(TOAST_KEY, '1'); } catch (e) {}
    }

    // Dismiss handlers
    dismissBtn?.addEventListener('click', hideToast);
    toast.addEventListener('click', (ev) => {
      // if clicking outside buttons, dismiss
      if (ev.target === toast) hideToast();
    });

    // Action: show fasilitas tab and hide
    showFasilitasBtn?.addEventListener('click', () => {
      window.switchTabAndSave(showFasilitasBtn.dataset.tab || 'fasilitas');
      hideToast();
    });

    // Only show if user hasn't seen it before and page has header buttons
    try {
      const seen = localStorage.getItem(TOAST_KEY);
      if (!seen && document.querySelectorAll('.header-btn').length) {
        // show after a small delay so page layout settles
        setTimeout(showToast, 900);
      }
    } catch (e) {
      // ignore storage errors
    }
  })();
}

// Run init immediately if the document is already ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayanan);
} else {
  initLayanan();
}
function initScrollProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

function initButtonRipple() {
  document.querySelectorAll('.header-btn, .footer-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      setTimeout(() => ripple.remove(), 600);
    });
  });
}
(function(){
  'use strict';
  const initFacilitiesToggle = () => {
    const pane = document.querySelector('.facilities-pane');
    if (!pane) return;
    const grid = pane.querySelector('.facility-grid');
    let btn = pane.querySelector('.facilities-toggle-btn');
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'facilities-toggle-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'facilityGrid');
        btn.textContent = 'Tampilkan semua';
        if (grid && grid.parentNode === pane) {
          grid.insertAdjacentElement('afterend', btn);
        } else {
          pane.appendChild(btn);
        }
        btn.style.position = 'sticky';
        btn.style.bottom = '8px';
        btn.style.display = 'block';
        btn.style.margin = '10px auto 0';
        btn.style.zIndex = '2';

        btn.addEventListener('click', () => {
          const expanded = pane.classList.toggle('expanded');
          btn.setAttribute('aria-expanded', String(expanded));
          btn.textContent = expanded ? 'Sembunyikan' : 'Tampilkan semua';

          if (!expanded) {
            const rect = pane.getBoundingClientRect();
            const offsetTop = window.pageYOffset + rect.top - 80;
            window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
          }
        });
      }
    } else {
      if (btn) btn.remove();
      pane.classList.remove('expanded');
    }
  };

  // Ensure the grid has an id for aria-controls
  const facilityGrid = document.querySelector('.facilities-pane .facility-grid');
  if (facilityGrid && !facilityGrid.id) facilityGrid.id = 'facilityGrid';

  initFacilitiesToggle();
  window.addEventListener('resize', initFacilitiesToggle);
})();
