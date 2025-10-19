// ===== INFORMASI PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTabNavigation();
    initNewsCarousel();
    initAgendaCards();
    initMobileMenu();
    initScrollEffects();
    initBottomNav();
});

// ===== TAB NAVIGATION =====
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentSections = document.querySelectorAll('.content-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Smooth scroll to section
            document.getElementById(targetTab).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// ===== NEWS CAROUSEL =====
function initNewsCarousel() {
    const track = document.getElementById('newsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const newsCards = document.querySelectorAll('.news-card');
    const newsCarouselContainer = document.querySelector('.news-carousel-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    let currentSlide = 0;
    const totalSlides = newsCards.length;
    let autoSlideInterval;
    
    // Touch swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    let isMobile = window.innerWidth <= 480;
    
    // Hide scroll indicator when user scrolls (mobile only)
    if (newsCarouselContainer && scrollIndicator && isMobile) {
        let scrollTimeout;
        newsCarouselContainer.addEventListener('scroll', function() {
            // Hide indicator on scroll
            scrollIndicator.style.opacity = '0';
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Show indicator again after user stops scrolling for 3 seconds
            scrollTimeout = setTimeout(function() {
                scrollIndicator.style.opacity = '1';
            }, 3000);
        });
    }
    
    // Auto-slide functionality
    function startAutoSlide() {
        // Only start auto-slide if not on mobile
        if (!isMobile) {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 3000);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    function updateSlidePosition() {
        // Only apply transform on non-mobile devices
        if (!isMobile) {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
            
            // Stop CSS animation when manually controlling
            track.style.animation = 'none';
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlidePosition();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
    }
    
    // Check if device is mobile
    function checkMobile() {
        isMobile = window.innerWidth <= 480;
        
        // Reset styles based on device type
        if (isMobile) {
            track.style.transform = '';
            track.style.animation = 'none';
        } else {
            updateSlidePosition();
        }
    }
    
    // Touch swipe handlers
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        // Prevent default only on mobile to allow scrolling
        if (isMobile) {
            e.stopPropagation();
        }
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }
    
    function handleSwipe() {
        // Only process swipe on mobile
        if (isMobile) {
            const swipeDistance = touchEndX - touchStartX;
            // Minimum swipe distance to trigger navigation
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    // Swipe right - do nothing, let natural scroll happen
                } else {
                    // Swipe left - do nothing, let natural scroll happen
                }
            }
        } else {
            // On desktop, use swipe for prev/next
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                stopAutoSlide();
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
                startAutoSlide();
            }
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = index;
            updateSlidePosition();
            startAutoSlide();
        });
    });
    
    // Touch events
    if (track) {
        track.addEventListener('touchstart', handleTouchStart, {passive: true});
        track.addEventListener('touchmove', handleTouchMove, {passive: false});
        track.addEventListener('touchend', handleTouchEnd, {passive: true});
        
        // Pause on hover (desktop only)
        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Handle window resize
    window.addEventListener('resize', checkMobile);
    
    // Initialize mobile check
    checkMobile();
    
    // News card clicks - open detail page or external link for specific news
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            const newsId = card.getAttribute('data-news-id');
            if (newsId === '1') {
                window.location.href = 'https://disparpora.bulukumbakab.go.id/event/festival-pinisi-tahun-2025/?fbclid=IwQ0xDSwM9_-9jbGNrAz3_ymV4dG4DYWVtAjExAAEek1hZFMAQdHvyKZAniEbfcUfkXK4-Y1jXVYyVNtHY0nqEw9j1TCf2oYbIcao_aem_KWWAICtUYzcE6wZ9XzaScA&sfnsn=wiwspwa';
            } else if (newsId === '2') {
                window.location.href = 'https://share.google/nWoC0ioadHOqHeDQ8';
            } else if (newsId === '3') {
                window.location.href = 'https://share.google/e5dUDnVxxfpRZCwZZ';
            } else {
                openNewsDetail(newsId);
            }
        });
    });
    
    // Start auto-slide
    startAutoSlide();
}

// ===== NEWS DETAIL HANDLER =====
function openNewsDetail(newsId) {
    // Redirect to the dedicated news detail page with the news ID as parameter
    window.location.href = `berita_detail.html?id=${newsId}`;
}

// ===== AGENDA CARDS =====
function initAgendaCards() {
    const agendaButtons = document.querySelectorAll('.agenda-detail-btn');
    const agendaCards = document.querySelectorAll('.agenda-card');
    
    agendaButtons.forEach(button => {
        button.addEventListener('click', () => {
            const agendaId = button.getAttribute('data-agenda-id');
            openAgendaDetail(agendaId);
        });
    });
    
    agendaCards.forEach(card => {
        const externalLink = card.getAttribute('data-external-link');
        if (externalLink) {
            card.addEventListener('click', () => {
                window.location.href = externalLink;
            });
        }
    });
}

function openAgendaDetail(agendaId) {
    // Redirect to the dedicated agenda detail page with the agenda ID as parameter
    window.location.href = `agenda_detail.html?id=${agendaId}`;
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Add scroll-based animations or effects here if needed
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const header = document.querySelector('.info-header');
        
        if (header) {
            if (scrollY > 100) {
                header.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
        }
    });
}

// ===== BOTTOM NAVIGATION =====
function initBottomNav() {
    // Initialize bottom navigation if it exists
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = item.getAttribute('href');
            if (targetUrl) {
                window.location.href = targetUrl;
            }
        });
    });
}
