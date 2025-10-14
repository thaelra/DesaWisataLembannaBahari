// Gallery 3D Carousel
class Gallery3D {
    constructor() {
        this.track = document.getElementById('galeriScroll');
        this.slides = Array.from(this.track.children);
        this.prevBtn = document.getElementById('galeriPrev');
        this.nextBtn = document.getElementById('galeriNext');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;

        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.goToPrevious());
        this.nextBtn.addEventListener('click', () => this.goToNext());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToPrevious();
            if (e.key === 'ArrowRight') this.goToNext();
        });

        // Touch/swipe support - Improved
        let startX = 0;
        let startY = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent page scrolling when swiping gallery
        }, { passive: false });

        this.track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            // Calculate horizontal and vertical distance
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only register as swipe if horizontal movement is greater than vertical
            // and greater than minimum threshold (30px)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                if (diffX > 0) {
                    this.goToNext();
                } else {
                    this.goToPrevious();
                }
            }
        });

        // Mouse drag support - Improved
        let isDragging = false;
        let dragStartX = 0;

        this.track.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            this.track.style.cursor = 'grabbing';
            e.preventDefault(); // Prevent text selection during drag
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            this.track.style.cursor = 'grab';

            const dragEndX = e.clientX;
            const diff = dragStartX - dragEndX;

            // Only register as drag if movement is greater than minimum threshold (30px)
            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    this.goToNext();
                } else {
                    this.goToPrevious();
                }
            }
        });

        // Auto-play (optional)
        setInterval(() => this.goToNext(), 5000);

        // Click to open modal for slides
        this.slides.forEach(slide => {
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', () => {
                const img = slide.querySelector('img');
                const video = slide.querySelector('video');
                
                if (video) {
                    // Handle video thumbnail click
                    const videoModal = document.getElementById('videoModal');
                    const videoPlayer = document.getElementById('videoPlayer');
                    
                    if (videoModal && videoPlayer) {
                        // Reset video player completely before setting new source
                        videoPlayer.pause();
                        videoPlayer.currentTime = 0;
                        videoPlayer.src = '';
                        
                        // Set new video source
                        videoPlayer.src = video.src;
                        videoPlayer.load(); // Force reload of the video element
                        
                        // Open modal and play video
                        videoModal.classList.add('open');
                        videoModal.setAttribute('aria-hidden', 'false');
                        document.body.style.overflow = 'hidden';
                        
                        // Play video after a short delay to ensure it's loaded
                        setTimeout(() => {
                            videoPlayer.play().catch(e => {
                                console.log('Video play failed:', e);
                            });
                        }, 100);
                    }
                } else if (img) {
                    openImageModal(img.src, img.alt || 'Gallery Image', 'Explore our beautiful gallery');
                }
            });
        });
    }

    updatePositions() {
        this.slides.forEach((slide, index) => {
            const relativeIndex = (index - this.currentIndex + this.totalSlides) % this.totalSlides;

            slide.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            switch(relativeIndex) {
                case 0: // Center
                    slide.style.transform = 'translateX(0px) translateZ(0px) rotateY(0deg)';
                    slide.style.opacity = '1';
                    slide.style.zIndex = '3';
                    break;
                case 1: // Right 1
                    slide.style.transform = 'translateX(200px) translateZ(-100px) rotateY(-15deg)';
                    slide.style.opacity = '0.8';
                    slide.style.zIndex = '2';
                    break;
                case 2: // Right 2
                    slide.style.transform = 'translateX(400px) translateZ(-200px) rotateY(-25deg)';
                    slide.style.opacity = '0.6';
                    slide.style.zIndex = '1';
                    break;
                case this.totalSlides - 1: // Left 1
                    slide.style.transform = 'translateX(-200px) translateZ(-100px) rotateY(15deg)';
                    slide.style.opacity = '0.8';
                    slide.style.zIndex = '2';
                    break;
                case this.totalSlides - 2: // Left 2
                    slide.style.transform = 'translateX(-400px) translateZ(-200px) rotateY(25deg)';
                    slide.style.opacity = '0.6';
                    slide.style.zIndex = '1';
                    break;
                default: // Hidden slides
                    slide.style.transform = 'translateX(600px) translateZ(-300px) rotateY(-30deg)';
                    slide.style.opacity = '0';
                    slide.style.zIndex = '0';
                    break;
            }
        });
    }

    goToNext() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updatePositions();
    }

    goToPrevious() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updatePositions();
    }
}

// Global function to open image modal
function openImageModal(src, title, description) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    if (imageModal && modalImage && modalTitle && modalDescription) {
        modalImage.src = src;
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        imageModal.style.display = 'block';
        setTimeout(() => {
            imageModal.classList.add('show');
        }, 10);

        document.body.style.overflow = 'hidden';
    }
}

// Hamburger menu functionality - executed immediately and robustly
function initializeHamburgerMenu() {
  const hamburger = document.getElementById('hamburgerMenu');
  const navAtas = document.querySelector('.nav-atas');
  const mainNav = document.querySelector('.main-nav');
  
  // Function to close the mobile menu
  function closeMobileMenu() {
    if (navAtas) navAtas.classList.remove('show-menu');
    if (hamburger) hamburger.classList.remove('active');
    if (mainNav) mainNav.classList.remove('show-menu');
    // Re-enable body scroll
    document.body.style.overflow = '';
  }

  // Function to open the mobile menu
  function openMobileMenu() {
    if (navAtas) navAtas.classList.add('show-menu');
    if (hamburger) hamburger.classList.add('active');
    if (mainNav) mainNav.classList.add('show-menu');
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }

  if (hamburger && navAtas) {
    // Remove existing event listeners if any
    hamburger.replaceWith(hamburger.cloneNode(true));
    const freshHamburger = document.getElementById('hamburgerMenu');
    
    // Hamburger click handler
    freshHamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isMenuOpen = navAtas.classList.contains('show-menu');
      
      if (isMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Click outside to close menu
    document.addEventListener('click', function(e) {
      const isClickInsideNav = navAtas.contains(e.target);
      const isMenuOpen = navAtas.classList.contains('show-menu');
      
      if (!isClickInsideNav && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // Escape key to close menu
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navAtas.classList.contains('show-menu')) {
        closeMobileMenu();
      }
    });
    
    // Close menu when mobile links are clicked (anchor links)
    function attachMobileLinksHandlers() {
      const mobileLinks = document.querySelectorAll('.mobile-menu-list a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Small delay to allow smooth scrolling before closing menu
          setTimeout(() => {
            closeMobileMenu();
          }, 300);
        });
      });
    }
    
    // Attach mobile links handlers
    attachMobileLinksHandlers();
    
    console.log('Hamburger menu initialized successfully');
  }
}

// Initialize hamburger menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHamburgerMenu);
} else {
  initializeHamburgerMenu();
}

// Backup initialization after a short delay in case DOMContentLoaded fails
setTimeout(initializeHamburgerMenu, 500);

document.addEventListener('DOMContentLoaded', function () {
    // Ensure akomodasi modal lives under body (avoid being inside grid)
    const akModal = document.getElementById('modal');
    
    // Timeline interaction handler - supports both hover (desktop) and click (mobile)
    const timelineRows = document.querySelectorAll('.timeline-row');
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    
    timelineRows.forEach(function(row) {
        if (isMobile) {
            // Mobile: Click to toggle
            row.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close all other timeline rows
                timelineRows.forEach(function(otherRow) {
                    if (otherRow !== row) {
                        otherRow.classList.remove('active');
                    }
                });
                
                // Toggle current row
                row.classList.toggle('active');
            });
        } else {
            // Desktop: Hover effect
            row.addEventListener('mouseenter', function() {
                row.classList.add('active');
            });
            row.addEventListener('mouseleave', function() {
                row.classList.remove('active');
            });
        }
    });
    
    // Close timeline content when clicking outside on mobile
    if (isMobile) {
        document.addEventListener('click', function(e) {
            const isTimelineClick = e.target.closest('.timeline-row');
            if (!isTimelineClick) {
                timelineRows.forEach(function(row) {
                    row.classList.remove('active');
                });
            }
        });
    }

    // Animate timeline rows when they enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe timeline rows
    document.querySelectorAll('.timeline-row').forEach(function(row) {
        observer.observe(row);
    });

    // Reveal Sejarah title on scroll similar to Data Desa title
    const sejarahTitle = document.querySelector('.sejarah-header h2');
    if (sejarahTitle) {
        sejarahTitle.classList.add('reveal');
        observer.observe(sejarahTitle);
    }

    // Reveal Data Desa elements (title and boxes)
    const revealEls = document.querySelectorAll('.data-desa-section .data-desa-title, .data-desa-section .data-desa-box');
    revealEls.forEach(el => {
        el.classList.add('reveal'); // start hidden and gently slide up on show
        observer.observe(el);
    });

    // Reveal VISI & MISI elements with unique motion
    const vmmEls = document.querySelectorAll('.visi-misi-section .visi-title, .visi-misi-section .visi-desc, .visi-misi-section .misi-title, .visi-misi-section .misi-list');
    vmmEls.forEach(el => {
        el.classList.add('vmm-reveal');
        observer.observe(el);
    });

    // Medsos smooth entrance (Instagram big card + tiles)
    const medsosAnimEls = document.querySelectorAll('.ms-animate');
    medsosAnimEls.forEach(el => observer.observe(el));

    // Person in Charge smooth entrance
    const personAnimEls = document.querySelectorAll('.person-in-charge-title, .person-card');
    personAnimEls.forEach(el => {
        el.classList.add('person-animate');
        observer.observe(el);
    });

    // Struktur reveal animations (menu, content, title)
    const strukturTitle = document.querySelector('.struktur-section .struktur-title');
    const strukturMenu = document.querySelector('.struktur-section .struktur-menu');
    const strukturContent = document.querySelector('.struktur-section .struktur-content');

    [strukturTitle, strukturMenu, strukturContent].forEach(el => {
        if (el) {
            el.classList.add('str-reveal');
            observer.observe(el);
        }
    });

    // Stagger reveal inside struktur-content
    if (strukturContent) {
        strukturContent.classList.add('str-reveal-stagger');
        const innerItems = strukturContent.querySelectorAll('.struktur-org-title, .struktur-list li, .struktur-pdf-btn, .struktur-org-img-wrapper');
        innerItems.forEach(item => observer.observe(item));
    }

    // Navbar floating logic
    const nav = document.querySelector('.profil-nav');
    const headerBg = document.querySelector('.header-bg');
    const navLinks = nav.querySelectorAll('a[href^="#"]');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    // Toggle floating state: dock nav to top as soon as header is mostly out OR when reaching Data Desa
    function updateNavFloating() {
        if (!nav) return;
        const headerH = headerBg ? headerBg.offsetHeight : 0;
        const dataDesa = document.getElementById('data-desa');
        const dataDesaTop = dataDesa ? dataDesa.offsetTop : Number.POSITIVE_INFINITY;
        // Dock point: earlier of (header mostly out) or (nearing Data Desa top)
        const headerThreshold = headerH > 0 ? headerH - 120 : 0; // buffer to dock a bit earlier
        const dataDesaThreshold = isFinite(dataDesaTop) ? (dataDesaTop - nav.offsetHeight - 16) : Number.POSITIVE_INFINITY;
        const dockPoint = Math.min(headerThreshold, dataDesaThreshold);

        if (window.scrollY >= dockPoint) {
            if (!nav.classList.contains('floating')) nav.classList.add('floating');
            document.body.classList.add('profil-nav-floating');
        } else {
            nav.classList.remove('floating');
            document.body.classList.remove('profil-nav-floating');
        }
    }

    window.addEventListener('scroll', updateNavFloating);
    window.addEventListener('resize', updateNavFloating);
    updateNavFloating();

    // Scrollspy highlight
    function onScroll() {
        let scrollPos = window.scrollY + nav.offsetHeight + 10;
        let found = false;
        sections.forEach((section, idx) => {
            if (
                section.offsetTop <= scrollPos &&
                section.offsetTop + section.offsetHeight > scrollPos
            ) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[idx].classList.add('active');
                found = true;
            }
        });
        if (!found) navLinks.forEach(link => link.classList.remove('active'));
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - nav.offsetHeight + 1,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Struktur Organisasi tab logic
    const strukturTabs = document.querySelectorAll('.struktur-tab');
    const strukturOrgs = document.querySelectorAll('.struktur-org');
    strukturTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            strukturTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            strukturOrgs.forEach(org => {
                org.style.display = org.id === tab.dataset.org ? 'block' : 'none';
            });
        });
    });

    // Awards gallery data (grouped by gallery id)
    const awardsGalleries = {
        'awards-unesco': [
            'asset/img/profil-desa/penghargaan-unesco.png'
        ],
        'awards-adwi': [
            'asset/img/profil-desa/pssti.jpg',
            'asset/img/profil-desa/piagam.jpeg',
            'asset/img/profil-desa/WhatsApp Image 2025-09-13 at 09.48.45 (5).jpeg',
            'asset/img/profil-desa/WhatsApp Image 2025-09-13 at 09.48.45 (4).jpeg'
        ], 
        'awards-adwi22' : [
            'asset/img/profil-desa/piagam-2022.jpeg'
        ]
    };

    // Awards Modal logic (open/close + slider)
    const awardsModal = document.getElementById('awardsModal');
    const awardsSlider = document.getElementById('awardsSlider');
    const awardsCounter = document.getElementById('awardsCounter');
    const awardsClose = document.getElementById('awardsClose');
    const awardsPrev = document.getElementById('awardsPrev');
    const awardsNext = document.getElementById('awardsNext');
    let currentGallery = [];
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    function openAwards(galleryId) {
        const imgs = awardsGalleries[galleryId];
        if (!imgs || !imgs.length) return;
        currentGallery = imgs;
        currentIndex = 0;
        awardsSlider.innerHTML = imgs.map(src => `<div class="awards-slide"><img src="${src}" alt="award"></div>`).join('');
        updateAwardsSlider();
        awardsModal.classList.add('open');
        awardsModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeAwards() {
        awardsModal.classList.remove('open');
        awardsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    function updateAwardsSlider() {
        const offset = -currentIndex * 100;
        awardsSlider.style.transform = `translateX(${offset}%)`;
        awardsCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    }
    function nextAwards() { currentIndex = (currentIndex + 1) % currentGallery.length; updateAwardsSlider(); }
    function prevAwards() { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateAwardsSlider(); }

    // Open handlers (buttons and card click/Enter)
    document.querySelectorAll('.award-view, .award-card').forEach(el => {
        el.addEventListener('click', () => {
            const gid = el.getAttribute('data-gallery') || el.querySelector('[data-gallery]')?.getAttribute('data-gallery');
            if (gid) openAwards(gid);
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const gid = el.getAttribute('data-gallery') || el.querySelector('[data-gallery]')?.getAttribute('data-gallery');
                if (gid) openAwards(gid);
            }
        });
    });

    // Close and nav buttons
    if (awardsClose) awardsClose.addEventListener('click', closeAwards);
    if (awardsPrev) awardsPrev.addEventListener('click', prevAwards);
    if (awardsNext) awardsNext.addEventListener('click', nextAwards);
    awardsModal?.addEventListener('click', e => { if (e.target === awardsModal) closeAwards(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!awardsModal || !awardsModal.classList.contains('open')) return;
        if (e.key === 'Escape') closeAwards();
        if (e.key === 'ArrowRight') nextAwards();
        if (e.key === 'ArrowLeft') prevAwards();
    });

    // Touch swipe
    awardsSlider?.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; }, {passive:true});
    awardsSlider?.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
            diff < 0 ? nextAwards() : prevAwards();
            isDragging = false;
        }
    }, {passive:true});
    awardsSlider?.addEventListener('touchend', () => { isDragging = false; });

    // Show/hide BPD PDF
    const openBpdPdfBtn = document.getElementById('openBpdPdf');
    const bpdPdfWrapper = document.getElementById('bpdPdfWrapper');
    if (openBpdPdfBtn && bpdPdfWrapper) {
        openBpdPdfBtn.addEventListener('click', function() {
            if (bpdPdfWrapper.style.display === 'none' || bpdPdfWrapper.style.display === '') {
                bpdPdfWrapper.style.display = 'block';
                openBpdPdfBtn.textContent = 'Tutup SK BPD';
            } else {
                bpdPdfWrapper.style.display = 'none';
                openBpdPdfBtn.textContent = 'Lihat SK BPD';
            }
        });
    }

    // Show/hide Bumdes PDF
    const openBumdesPdfBtn = document.getElementById('openBumdesPdf');
    const bumdesPdfWrapper = document.getElementById('bumdesPdfWrapper');
    if (openBumdesPdfBtn && bumdesPdfWrapper) {
        openBumdesPdfBtn.addEventListener('click', function() {
            if (bumdesPdfWrapper.style.display === 'none' || bumdesPdfWrapper.style.display === '') {
                bumdesPdfWrapper.style.display = 'block';
                openBumdesPdfBtn.textContent = 'Tutup SK BUMDES';
            } else {
                bumdesPdfWrapper.style.display = 'none';
                openBumdesPdfBtn.textContent = 'Lihat SK BUMBES';
            }
        });
    }

    // Show/hide Karang Taruna PDF
    const openKarangTarunaPdfBtn = document.getElementById('openKarangTarunaPdf');
    const karangTarunaPdfWrapper = document.getElementById('karangTarunaPdfWrapper');
    if (openKarangTarunaPdfBtn && karangTarunaPdfWrapper) {
        openKarangTarunaPdfBtn.addEventListener('click', function() {
            if (karangTarunaPdfWrapper.style.display === 'none' || karangTarunaPdfWrapper.style.display === '') {
                karangTarunaPdfWrapper.style.display = 'block';
                openKarangTarunaPdfBtn.textContent = 'Tutup SK KARANG TARUNA';
            } else {
                karangTarunaPdfWrapper.style.display = 'none';
                openKarangTarunaPdfBtn.textContent = 'Lihat SK KARANG TARUNA';
            }
        });
    }

    // Show/hide Pokdarwis PDF
    const openPokdarwisPdfBtn = document.getElementById('openPokdarwisPdf');
    const pokdarwisPdfWrapper = document.getElementById('pokdarwisPdfWrapper');
    if (openPokdarwisPdfBtn && pokdarwisPdfWrapper) {
        openPokdarwisPdfBtn.addEventListener('click', function() {
            if (pokdarwisPdfWrapper.style.display === 'none' || pokdarwisPdfWrapper.style.display === '') {
                pokdarwisPdfWrapper.style.display = 'block';
                openPokdarwisPdfBtn.textContent = 'Tutup SK POKDARWIS';
            } else {
                pokdarwisPdfWrapper.style.display = 'none';
                openPokdarwisPdfBtn.textContent = 'Lihat SK POKDARWIS';
            }
        });
    }

    // Show/hide Sardes PDF
    const openSardesPdfBtn = document.getElementById('openSardesPdf');
    const sardesPdfWrapper = document.getElementById('sardesPdfWrapper');
    if (openSardesPdfBtn && sardesPdfWrapper) {
        openSardesPdfBtn.addEventListener('click', function() {
            if (sardesPdfWrapper.style.display === 'none' || sardesPdfWrapper.style.display === '') {
                sardesPdfWrapper.style.display = 'block';
                openSardesPdfBtn.textContent = 'Tutup SK SARDES';
            } else {
                sardesPdfWrapper.style.display = 'none';
                openSardesPdfBtn.textContent = 'Lihat SK SARDES';
            }
        });
    }

    // Pop-out image modal for Struktur Organisasi BPD
    const strukturImg = document.getElementById('bpdStrukturImg');
    const imgModal = document.getElementById('imgModal');
    const imgModalContent = document.getElementById('imgModalContent');
    const imgModalClose = document.getElementById('imgModalClose');

    if (strukturImg && imgModal && imgModalContent && imgModalClose) {
        strukturImg.addEventListener('click', function() {
            imgModal.style.display = 'flex';
            imgModalContent.src = strukturImg.src;
        });
        imgModalClose.addEventListener('click', function() {
            imgModal.style.display = 'none';
            imgModalContent.src = '';
        });
        imgModal.addEventListener('click', function(e) {
            if (e.target === imgModal) {
                imgModal.style.display = 'none';
                imgModalContent.src = '';
            }
        });
    }

    // =====================
    // PETA: Tabs, Reveal, Modal
    // =====================
    (function(){
        const tabPeta = document.getElementById('tabPeta');
        const tabEv = document.getElementById('tabEvakuasi');
        const tabTs = document.getElementById('tabTsunami');
        const panelPeta = document.getElementById('panelPeta');
        const panelEv = document.getElementById('panelEvakuasi');
        const panelTs = document.getElementById('panelTsunami');

        function activate(tab){
            if(!tab) return;
            // Deactivate all
            [tabPeta, tabEv, tabTs].forEach(t => {
                if(t) {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                }
            });
            [panelPeta, panelEv, panelTs].forEach(p => {
                if(p) {
                    p.hidden = true;
                    p.classList.remove('active');
                    p.classList.remove('in');
                }
            });
            // Activate selected
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            let panel;
            if(tab === tabPeta) panel = panelPeta;
            else if(tab === tabEv) panel = panelEv;
            else if(tab === tabTs) panel = panelTs;
            if(panel) {
                panel.hidden = false;
                panel.classList.add('active');
                // Add 'in' after a short delay to ensure reveal animation triggers
                setTimeout(() => panel.classList.add('in'), 10);
            }
        }
        tabPeta && tabPeta.addEventListener('click', ()=>activate(tabPeta));
        tabEv && tabEv.addEventListener('click', ()=>activate(tabEv));
        tabTs && tabTs.addEventListener('click', ()=>activate(tabTs));

        // Reveal on scroll khusus peta
        const ioPeta = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{ if(e.isIntersecting) { e.target.classList.add('in'); ioPeta.unobserve(e.target);} });
        }, { threshold:.15 });
        document.querySelectorAll('#peta .reveal').forEach(el=>ioPeta.observe(el));

        // Modal gallery untuk peta - per panel
        const imagesPeta = ['asset/img/profil-desa/peta.jpeg'];
        const imagesEvakuasi = ['asset/img/profil-desa/jalur-evakuasi.jpeg' , 'asset/img/profil-desa/Jalur-evakuasi.jpg'];
        const imagesTsunami = ['asset/img/profil-desa/tsunami.jpeg'];
        const modal = document.getElementById('mapModal');
        const stage = document.getElementById('mapStageImg');
        const counter = document.getElementById('mapCounter');
        const closeBtn = document.getElementById('mapClose');
        const prevBtn = document.getElementById('mapPrev');
        const nextBtn = document.getElementById('mapNext');
        let currentImages = [];
        let idx = 0;
        
        function update(){ 
            if(stage && counter && currentImages.length){ 
                stage.src = currentImages[idx]; 
                counter.textContent = (idx+1)+' / '+currentImages.length; 
            } 
        }
        
        function open(panelIndex){ 
            if(!modal) return;
            if(panelIndex === 0) currentImages = imagesPeta;
            else if(panelIndex === 1) currentImages = imagesEvakuasi;
            else if(panelIndex === 2) currentImages = imagesTsunami;
            idx = 0; 
            update(); 
            modal.classList.add('open'); 
            modal.setAttribute('aria-hidden','false'); 
            document.body.style.overflow='hidden';
        }
        
        function close(){ 
            if(!modal) return; 
            modal.classList.remove('open'); 
            modal.setAttribute('aria-hidden','true'); 
            document.body.style.overflow=''; 
        }
        
        function prev(){ 
            if(currentImages.length > 1){ 
                idx = (idx-1+currentImages.length)%currentImages.length; 
                update(); 
            } 
        }
        
        function next(){ 
            if(currentImages.length > 1){ 
                idx = (idx+1)%currentImages.length; 
                update(); 
            } 
        }
        
        // Make map images clickable - attach to buttons, figures, and images themselves
        document.querySelectorAll('#peta .peta-view-btn, #peta .peta-figure, #peta .peta-img').forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                // Find the data-index from the element or its parent
                let dataIndex = element.getAttribute('data-index');
                if (!dataIndex && element.parentElement) {
                    dataIndex = element.parentElement.getAttribute('data-index');
                }
                const i = Number(dataIndex) || 0;
                open(i);
            });
        });
        
        // Close button
        closeBtn && closeBtn.addEventListener('click', close);
        
        // Navigation buttons
        prevBtn && prevBtn.addEventListener('click', prev);
        nextBtn && nextBtn.addEventListener('click', next);
        
        // Close when clicking outside the modal content (anywhere on the modal overlay)
        modal && modal.addEventListener('click', (e) => { 
            if (e.target === modal || e.target.classList.contains('map-modal-content')) {
                close(); 
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => { 
            if(!modal || !modal.classList.contains('open')) return; 
            if(e.key === 'Escape') close(); 
            if(e.key === 'ArrowLeft') prev(); 
            if(e.key === 'ArrowRight') next(); 
        });

    })();


    // Facilities pane expand/collapse toggle (mobile only)
    (function(){
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
                    // Keep button visible at bottom of the pane on mobile
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
                            const offsetTop = window.pageYOffset + rect.top - 80; // keep pane in view when collapsing
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
        if (facilityGrid && !facilityGrid.id) {
            facilityGrid.id = 'facilityGrid';
        }

        initFacilitiesToggle();
        window.addEventListener('resize', initFacilitiesToggle);
    })();

    // Initialize carousel when page loads
    new Gallery3D();

    // Map pane clickable functionality
    const mapPane = document.querySelector('.map-pane');
    const mapImage = document.querySelector('.map-image');
    
    if (mapPane && mapImage) {
        // Add cursor pointer to indicate clickability
        mapPane.style.cursor = 'pointer';
        
        // Create modal for full map image
        const mapModal = document.createElement('div');
        mapModal.id = 'fullMapModal';
        mapModal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            cursor: pointer;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        const mapModalContent = document.createElement('div');
        mapModalContent.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
            position: relative;
            cursor: default;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const fullMapImage = document.createElement('img');
        fullMapImage.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        // Get the background image from the map-image element
        const mapBackgroundImage = window.getComputedStyle(mapImage).backgroundImage;
        const imageUrl = mapBackgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
        fullMapImage.src = imageUrl;
        fullMapImage.alt = 'Full Map View';
        
        mapModalContent.appendChild(fullMapImage);
        mapModal.appendChild(mapModalContent);
        document.body.appendChild(mapModal);
        
        // Open modal when map pane is clicked
        mapPane.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mapModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal when clicking anywhere on the modal
        mapModal.addEventListener('click', function(e) {
            if (e.target === mapModal || e.target === fullMapImage) {
                mapModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mapModal.style.display === 'flex') {
                mapModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Add responsive behavior
        function updateModalResponsiveness() {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth <= 1024;
            
            if (isMobile) {
                mapModal.style.padding = '10px';
                fullMapImage.style.borderRadius = '4px';
            } else if (isTablet) {
                mapModal.style.padding = '15px';
                fullMapImage.style.borderRadius = '6px';
            } else {
                mapModal.style.padding = '20px';
                fullMapImage.style.borderRadius = '8px';
            }
        }
        
        // Update on resize
        window.addEventListener('resize', updateModalResponsiveness);
        
        // Initial responsive setup
        updateModalResponsiveness();
        
        // Add touch support for mobile
        let touchStartY = 0;
        let touchStartX = 0;
        
        mapModal.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        mapModal.addEventListener('touchend', function(e) {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaX = Math.abs(touchEndX - touchStartX);
            
            // Close on swipe down or tap outside image
            if (deltaY > 50 || (deltaX < 10 && deltaY < 10 && e.target === mapModal)) {
                mapModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }, { passive: true });
    }

});

// Image Grid Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Grid items data with descriptions
    const gridItemsData = [
        {
            id: 1,
            imgSrc: "asset2/WhatsApp Image 2025-08-19 at 20.18.00_be7aa69c.jpg",
            title: "Pantai Mandala Ria",
            description: " "
        },
        {
            id: 2,
            title: "Batu Tongkarraya",
            description: " "
        },
        {
            id: 3,
            title: "Laut Mandala Ria",
            description: " "
        },
        {
            id: 4,
            title: "Tebing Mattoanging",
            description: " "
        },
        {
            id: 5,
            title: "Pantai Mandala Ria",
            description: " "
        },
        {
            id: 6,
            title: "Gua Passea",
            description: " "
        },
        {
            id: 7,
            title: "Pantai Mandala Ria",
            description: ""
        },
        {
            id: 8,
            title: "Tebing Mattoanging",
            description: " "
        },
        {
            id: 9,
            title: "Tebing Mattoanging",
            description: ""
        }
    ];

    // Additional items for "Load More" functionality
    const additionalItems = [
        {
            id: 10,
            size: "wide",
            imgSrc: "asset/img/wisata andalah/gua-passea-2.jpg",
            title: "Gua Passea",
            description: " "
        },
        {
            id: 11,
            size: "wide-a",
            imgSrc: "asset/img/wisata andalah/pantai-mandala-8.jpg",
            title: "Pantai Mandala",
            description: " "
        },
        {
            id: 12,
            size: "large",
            imgSrc: "asset/img/wisata andalah/batu-tongkarayya-2.jpg",
            title: "Batu Tongkarayya",
            description: ""
        },
        {
            id: 13,
            size: "medium",
            imgSrc: "asset/img/wisata andalah/pantai-mandala-9.jpeg",
            title: " ",
            description: " "
        },
        {
            id: 14,
            size: "medium",
            imgSrc: "asset/img/wisata andalah/pantai-mandala-6.webp",
            title: " ",
            description: " "
        },
        {
            id: 15,
            size: "medium",
            imgSrc: "asset2/WhatsApp Image 2025-08-20 at 12.40.59.jpeg",
            title: " ",
            description: " "
        }
    ];

    // Get DOM elements
    const imageGrid = document.querySelector('.image-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const seeLessBtn = document.getElementById('seeLessBtn');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.image-modal-close');

    // Skip if elements don't exist (in case this script runs on other pages)
    if (!imageGrid || !loadMoreBtn || !seeLessBtn || !imageModal) return;

    // Flag to track if additional items are loaded
    let additionalItemsLoaded = false;

    // Open modal when clicking on a grid item
    imageGrid.addEventListener('click', function(e) {
        const gridItem = e.target.closest('.grid-item');
        if (gridItem) {
            const itemId = parseInt(gridItem.dataset.id);
            const itemData = [...gridItemsData, ...additionalItems].find(item => item.id === itemId);

            if (itemData) {
                const img = gridItem.querySelector('img');
                if (img) {
                    // Open image modal
                    modalImage.src = img.src;
                    modalTitle.textContent = itemData.title;
                    modalDescription.textContent = itemData.description;

                    imageModal.style.display = 'block';
                    setTimeout(() => {
                        imageModal.classList.add('show');
                    }, 10);

                    document.body.style.overflow = 'hidden';
                } else {
                    const video = gridItem.querySelector('video');
                    if (video) {
                        // Open video modal
                        videoPlayer.src = video.src;
                        openVideoModal();
                    }
                }
            }
        }
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeModal();
        }
    });

    function closeModal() {
        imageModal.classList.remove('show');
        setTimeout(() => {
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Load more items
    loadMoreBtn.addEventListener('click', function() {
        if (!additionalItemsLoaded) {
            additionalItems.forEach(item => {
                const gridItem = document.createElement('div');
                gridItem.className = `grid-item ${item.size}`;
                gridItem.dataset.id = item.id;
                
                gridItem.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="grid-item-overlay">
                        <h3>${item.title}</h3>
                        <p>Click to view details</p>
                    </div>
                `;
                
                imageGrid.appendChild(gridItem);
            });
            
            additionalItemsLoaded = true;
            loadMoreBtn.style.display = 'none';
            seeLessBtn.style.display = 'block';
        }
    });

    // See less (remove additional items)
    seeLessBtn.addEventListener('click', function() {
        if (additionalItemsLoaded) {
            const items = imageGrid.querySelectorAll('.grid-item');
            for (let i = items.length - 1; i >= items.length - additionalItems.length; i--) {
                items[i].remove();
            }
            
            additionalItemsLoaded = false;
            seeLessBtn.style.display = 'none';
            loadMoreBtn.style.display = 'block';
        }
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.style.display === 'block') {
            closeModal();
        }
    });

    // Video Modal logic
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoClose = document.getElementById('videoClose');
    const openVideoModalBtn = document.getElementById('openVideoModal');

    function openVideoModal() {
        if (videoModal && videoPlayer) {
            videoModal.classList.add('open');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Play video with error handling
            videoPlayer.play().catch(e => {
                console.log('Video play failed:', e);
            });
        }
    }

    function closeVideoModal() {
        if (videoModal && videoPlayer) {
            videoModal.classList.remove('open');
            videoModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Completely reset video player state
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.removeAttribute('src');
            videoPlayer.load(); // Clear the video element
            
            // Remove any event listeners that might interfere
            videoPlayer.onloadeddata = null;
            videoPlayer.oncanplay = null;
        }
    }

    if (openVideoModalBtn) {
        openVideoModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openVideoModal();
        });
    }

    if (videoClose) {
        videoClose.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) {
            closeVideoModal();
        }
    });
});
