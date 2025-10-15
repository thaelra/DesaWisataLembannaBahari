(function(){
  'use strict';

  window.__IMAGE_DB = window.__IMAGE_DB || {
    // UMKM product pages
    'umkm_snack': [
      { src: 'asset3/IMG/UMKM Andalan/WhatsApp Image 2025-08-24 at 12.06.48 PM.jpeg', alt: 'Keripik Pisang - view 1' },
      { src: 'asset3/IMG/UMKM Andalan/WhatsApp Image 2025-08-24 at 12.06.49 PM (1).jpeg', alt: 'Keripik Pisang - view 2' },
      { src: 'asset3/IMG/UMKM Andalan/WhatsApp Image 2025-08-24 at 12.06.49 PM (2).jpeg', alt: 'Keripik Pisang - view 3' }
    ],
    'umkm_snack_v2': [
      { src: 'asset3/IMG/UMKM Andalan/WhatsApp Image 2025-08-24 at 12.06.49 PM.jpeg', alt: 'Keripik Pisang - main' },
      { src: 'asset3/IMG/UMKM Andalan/WhatsApp Image 2025-08-24 at 12.06.49 PM (2).jpeg', alt: 'Keripik Pisang - alt' }
    ],

    // Bengkel / Souvenir
    'bengkel_souvernier': [
      { src: 'asset3/IMG/Bengkel/souvenir-1.jpeg', alt: 'Souvenir kapal 1' },
      { src: 'asset3/IMG/Bengkel/souvenir-2.jpeg', alt: 'Souvenir kapal 2' },
      { src: 'asset3/IMG/Bengkel/souvenir-3.jpeg', alt: 'Souvenir kapal 3' },
      { src: 'asset3/IMG/Bengkel/souvenir-5.jpeg', alt: 'Souvenir kapal 5' },
      { src: 'asset3/IMG/Bengkel/souvenir-6.jpeg', alt: 'Souvenir kapal 6' }
    ]
  };

})();
const galleryImageMap = {
	'fasilitas_kamar-mandi.html': [
		'asset3/IMG/Kamar mandi umum terbaik di Mandala Ria Beach.jpg',
	],
	'fasilitas_pusat-informasi.html': [
		'asset3/IMG/Pusat_info/Pusat_informasi.jpeg',
	],
	'fasilitas_pusat-informasi-2.html': [
		'asset3/IMG/Pusat_info/Pusat_informasi_2.jpeg',
	],
	'fasilitas_taman-camping.html': [
		'asset3/IMG/Camping_ground/Camping Ground-1.jpeg',
		'asset3/IMG/Camping_ground/Camping Ground-2.jpeg',
		'asset3/IMG/Camping_ground/Camping Ground-3.jpeg',
		'asset3/IMG/Camping_ground/Camping Ground-4.jpeg',
		'asset3/IMG/Camping_ground/Camping Ground-5.jpeg',
		'asset3/IMG/Camping_ground/Camping Ground-6.jpeg',
	],
	'fasilitas_tempat-ibadah.html': [
		'asset3/IMG/Musollah/Masjid.jpeg',
        'asset3/IMG/Musollah/Masjid_1.jpeg',
	],
	'fasilitas_tempat-ibadah-2.html': [
		'asset3/IMG/Musollah/Musolah_villa.jpeg',
        'asset3/IMG/Musollah/Musolah_villa_2.jpeg',
	],
};

(function(){
  'use strict';

  const qs = selector => document.querySelector(selector);
  const qsa = selector => Array.from(document.querySelectorAll(selector));

  const mainImage = qs('#mainImage');
  let thumbItems = qsa('.thumb-item');
  const zoomBtn = qs('#zoomBtn');
  const lightbox = qs('#lightbox');
  const lightboxImage = qs('#lightboxImage');
  const lightboxClose = qs('#lightboxClose');
  const lightboxPrev = qs('#lightboxPrev');
  const lightboxNext = qs('#lightboxNext');

  const pageKey = document.body?.dataset?.page;
  if((!thumbItems.length || thumbItems.every(t => !t.dataset.src)) && pageKey && window.__IMAGE_DB && Array.isArray(window.__IMAGE_DB[pageKey])){
    const list = window.__IMAGE_DB[pageKey];
    const thumbsContainer = qs('.gallery-thumbs');
    if(thumbsContainer && list.length){
      thumbsContainer.innerHTML = '';
      list.forEach((imgObj, idx) => {
        const div = document.createElement('div');
        div.className = 'thumb-item' + (idx===0? ' active':'');
        div.setAttribute('data-src', imgObj.src);
        if(imgObj.alt) div.setAttribute('data-alt', imgObj.alt);
        thumbsContainer.appendChild(div);
      });
      thumbItems = qsa('.thumb-item');
    }
  }

  if(!thumbItems.length) return; 


  const images = thumbItems.map(item => item.dataset.src).filter(Boolean);

  // Initialize thumbnails (lazy set img src from data-src)
  thumbItems.forEach((item, index) => {
    const src = item.dataset.src;
    // If an <img> exists inside, keep it but lazy-load
    const img = item.querySelector('img');
    if(img) {
      // keep original as commented fallback in HTML; here we lazy-load
      img.loading = 'lazy';
      img.decoding = 'async';
      if(!img.src) img.src = src;
    } else {
      // create an img element for progressive enhancement
      const el = document.createElement('img');
      el.loading = 'lazy';
      el.decoding = 'async';
      el.alt = item.dataset.alt || '';
      el.src = src;
      item.appendChild(el);
    }
    // mark first thumb as active by default
    if(index === 0) item.classList.add('active');
  });

  let currentIndex = 0;

  function setMain(src){
    if(!mainImage) return;
    // Use dataset-src as canonical source to allow commented <img> fallback in HTML
    mainImage.src = src;
    mainImage.setAttribute('data-current', src);
  }

  function setActiveThumbnail(i){
    thumbItems.forEach((t, idx) => t.classList.toggle('active', idx === i));
  }

  // Wire thumbnail clicks
  thumbItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentIndex = idx;
      setMain(images[currentIndex]);
      setActiveThumbnail(currentIndex);
    });
  });

  // Lightbox controls
  function openLightbox(){
    if(!lightbox || !lightboxImage) return;
    lightbox.classList.add('active');
    lightboxImage.src = images[currentIndex];
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  function nextImage(){
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex];
    setMain(images[currentIndex]);
    setActiveThumbnail(currentIndex);
  }
  function prevImage(){
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
    setMain(images[currentIndex]);
    setActiveThumbnail(currentIndex);
  }

  // Zoom toggle inside lightbox
  let zoomed = false;
  function toggleZoom(){
    if(!lightboxImage) return;
    zoomed = !zoomed;
    lightboxImage.classList.toggle('zoomed', zoomed);
  }

  // Attach zoom button if present
  zoomBtn?.addEventListener('click', openLightbox);

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });

  lightboxNext?.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  lightboxPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  lightboxImage?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleZoom();
  });

  document.addEventListener('keydown', (e) => {
    if(!lightbox || !lightbox.classList.contains('active')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') nextImage();
    if(e.key === 'ArrowLeft') prevImage();
  });

  // Touch swipe on lightbox
  (function(){
    let startX = 0;
    let endX = 0;
    lightbox?.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; });
    lightbox?.addEventListener('touchend', (e) => { endX = e.changedTouches[0].screenX; handleSwipe(); });
    function handleSwipe(){
      const diff = startX - endX;
      if(Math.abs(diff) < 40) return;
      if(diff > 0) nextImage(); else prevImage();
    }
  })();

  // Init main image if missing
  if(mainImage && !mainImage.src) setMain(images[0]);

  // Provide a global accessor for debugging
  window.__UMKMImageController = {
    images,
    getCurrentIndex: () => currentIndex,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
    setMain
  };

})();

//Fasilitas

// Get current HTML filename
function getCurrentHtmlFile() {
	const path = window.location.pathname;
	return path.substring(path.lastIndexOf('/') + 1);
}

const galleryImages = galleryImageMap[getCurrentHtmlFile()] || [
	'IMG/WhatsApp Image 2025-08-20 at 3.35.03 PM.jpeg',
];

function createSlideshow() {
	const gallery = document.querySelector('.gallery');
	if (!gallery) return;
	gallery.innerHTML = `
		<div class="slideshow-container">
			<button class="slide-btn left" aria-label="Previous"><span>&#10094;</span></button>
			<div class="slide-wrapper">
				<img class="slide-img" src="${galleryImages[0]}" alt="Galeri Desa" tabindex="0" />
			</div>
			<button class="slide-btn right" aria-label="Next"><span>&#10095;</span></button>
			<div class="slide-dots">
				${galleryImages.map((_,i)=>`<span class="dot${i===0?' active':''}" data-index="${i}"></span>`).join('')}
			</div>
			<div class="zoom-overlay">
				<img class="zoom-img" src="" alt="Zoomed" />
				<span class="close-zoom">&times;</span>
			</div>
		</div>
	`;

	let current = 0;
	const img = gallery.querySelector('.slide-img');
	const leftBtn = gallery.querySelector('.slide-btn.left');
	const rightBtn = gallery.querySelector('.slide-btn.right');
	const dots = gallery.querySelectorAll('.dot');
	const overlay = gallery.querySelector('.zoom-overlay');
	const zoomImg = gallery.querySelector('.zoom-img');
	const closeZoom = gallery.querySelector('.close-zoom');

	function showSlide(idx) {
		current = (idx + galleryImages.length) % galleryImages.length;
		img.src = galleryImages[current];
		dots.forEach((d,i)=>d.classList.toggle('active',i===current));
	}

	leftBtn.onclick = () => showSlide(current-1);
	rightBtn.onclick = () => showSlide(current+1);
	dots.forEach((d,i)=>d.onclick=()=>showSlide(i));

	// Zoom functionality
	img.onclick = () => {
		overlay.classList.add('active');
		zoomImg.src = galleryImages[current];
	};
	closeZoom.onclick = () => overlay.classList.remove('active');
	overlay.onclick = e => { if(e.target===overlay) overlay.classList.remove('active'); };
	// Keyboard navigation
	document.addEventListener('keydown', e => {
		if(document.activeElement === img || overlay.classList.contains('active')) {
			if(e.key==='ArrowLeft') showSlide(current-1);
			if(e.key==='ArrowRight') showSlide(current+1);
			if(e.key==='Escape') overlay.classList.remove('active');
		}
	});
}

document.addEventListener('DOMContentLoaded', createSlideshow);

// Mobile nav toggle for fasilitas detail pages
document.addEventListener('DOMContentLoaded', function() {
	const navToggle = document.getElementById('navToggle');
	const navMenu = document.querySelector('.nav-menu');

	// create overlay element if not present
	let overlay = document.getElementById('navOverlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.id = 'navOverlay';
		document.body.appendChild(overlay);
	}

	function openMenu() {
		navMenu && navMenu.classList.add('active');
		navToggle && navToggle.classList.add('active');
		overlay.classList.add('show');
		document.body.classList.add('menu-open');
	}

	function closeMenu() {
		navMenu && navMenu.classList.remove('active');
		navToggle && navToggle.classList.remove('active');
		overlay.classList.remove('show');
		document.body.classList.remove('menu-open');
	}

	if (navToggle) {
		navToggle.addEventListener('click', function() {
			if (navMenu.classList.contains('active')) closeMenu();
			else openMenu();
		});
	}

	// Close when clicking overlay
	overlay.addEventListener('click', closeMenu);

	// Close when clicking any nav link
	document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
		link.addEventListener('click', () => {
			// if it's an internal anchor, allow smooth scroll; otherwise, close immediately
			closeMenu();
		});
	});

	// Close on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeMenu();
	});
	// Contact button
if (typeof contactBtn !== 'undefined' && contactBtn) {
    contactBtn.addEventListener('click', () => {
        window.open('https://wa.me/6285230786055?text=Halo,%20saya%20tertarik%20dengan%20produk%20kapalpinisi', '_blank');
    });
}

});
