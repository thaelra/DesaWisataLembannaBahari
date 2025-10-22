document.addEventListener('DOMContentLoaded', () => {
  // Check if functions exist before calling them to prevent errors
  if (typeof initFloatingCards === 'function') initFloatingCards();
  if (typeof initParallax === 'function') initParallax();
  if (typeof initScrollToTop === 'function') initScrollToTop();
  if (typeof initAnimations === 'function') initAnimations();
  if (typeof initTabs === 'function') initTabs();
  initScrollProgressBar();
  initButtonRipple();
});

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


// Responsive facilities toggle: create button for widths < 1920px
(function(){
  const BREAKPOINT = 1920;

  function ensureGridId(grid) {
    if (grid && !grid.id) grid.id = 'facilityGrid';
  }

  function createToggle() {
    const pane = document.querySelector('.facilities-pane');
    if (!pane) return;
    const grid = pane.querySelector('.facility-grid');
    if (!grid) return;

    ensureGridId(grid);

    // if a button already exists, keep it
    let btn = pane.querySelector('.facilities-toggle-btn');
    if (window.innerWidth < BREAKPOINT) {
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'facilities-toggle-btn';
        btn.setAttribute('aria-expanded', String(pane.classList.contains('expanded')));
        btn.setAttribute('aria-controls', grid.id || 'facilityGrid');
        btn.textContent = pane.classList.contains('expanded') ? 'Sembunyikan' : 'Tampilkan semua';
        // insert after the grid for natural flow
        grid.insertAdjacentElement('afterend', btn);

        btn.addEventListener('click', () => {
          try {
            const expanded = pane.classList.toggle('expanded');
            btn.setAttribute('aria-expanded', String(expanded));
            btn.textContent = expanded ? 'Sembunyikan' : 'Tampilkan semua';

            if (!expanded) {
              // when collapsing, scroll pane into view so header doesn't cover it
              const rect = pane.getBoundingClientRect();
              const offsetTop = window.pageYOffset + rect.top - 80;
              window.scrollTo({ 
                top: Math.max(0, offsetTop), 
                behavior: 'smooth' 
              });
            }
          } catch (error) {
            console.error('Error in facilities toggle button:', error);
          }
        });
      } else {
        // keep label in sync with current state
        const expanded = pane.classList.contains('expanded');
        btn.setAttribute('aria-expanded', String(expanded));
        btn.textContent = expanded ? 'Sembunyikan' : 'Tampilkan semua';
      }
    } else {
      if (btn) btn.remove();
      pane.classList.remove('expanded');
    }
  }

  function init() {
    createToggle();
    window.addEventListener('resize', createToggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
