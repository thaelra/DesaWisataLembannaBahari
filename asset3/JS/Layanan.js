document.addEventListener('DOMContentLoaded', () => {
  initFloatingCards();
  initParallax();
  initScrollToTop();
  initAnimations();
  initTabs();
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
