document.addEventListener('DOMContentLoaded', () => {
  initFloatingCards();
  initParallax();
  initScrollToTop();
  initAnimations();
  initTabs();
  initScrollProgressBar();
  initButtonRipple();
});

// Make header/nav follow scroll like profil page: sticky, shrink/restore on scroll
(function() {
  let lastScroll = 0;
  const header = document.querySelector('.header');
  const navWrapper = document.querySelector('.nav-wrapper');
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (!header || !navWrapper) return;

  // Add sticky container for nav after header when scrolled
  function onScroll() {
    const current = window.scrollY || window.pageYOffset;

    // Add 'scrolled' when past header height/60
    if (current > 60) {
      header.classList.add('small');
      navWrapper.classList.add('sticky');
    } else {
      header.classList.remove('small');
      navWrapper.classList.remove('sticky');
    }

    // Show/hide nav based on scroll direction for minimal distraction
    if (current > lastScroll && current > 120) {
      // scrolling down -> hide
      navWrapper.classList.add('nav-hidden');
    } else {
      // scrolling up -> show
      navWrapper.classList.remove('nav-hidden');
    }

    lastScroll = current <= 0 ? 0 : current; // For Mobile or negative scrolling
  }

  // Ensure hamburger toggles when nav-wrapper sticky
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // initial state
  onScroll();
})();

document.addEventListener('DOMContentLoaded', () => {
  // Floating cards animation delay setup
  document.querySelectorAll('.info-card').forEach((card, index) => {
    card.style.setProperty('--delay', `${1 + index * 0.2}s`);
  });

  // Parallax effect for header
  const headerContainer = document.querySelector('.header-container') || document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (!headerContainer) return;
    const parallax = window.pageYOffset * 0.5;
    headerContainer.style.transform = `translateY(${parallax}px)`;
  });

  // Scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.id = 'scrollToTopBtn';
  scrollToTopBtn.title = 'Kembali ke atas';
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
  });

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

  document.querySelectorAll('.header-btn').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  switchTab('produk'); // default tab
});
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
