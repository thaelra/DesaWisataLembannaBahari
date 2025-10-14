# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project type: static HTML/CSS/JS website (no build system, no package manager, no tests configured).

Common commands (Windows PowerShell)

- Serve locally (choose one):
  - Python
    - py -m http.server 8000
  - Node.js
    - npx http-server -p 8000 .
    - or: npx serve -l 8000 .

Then open http://localhost:8000/index.html

- Open a specific page directly
  - http://localhost:8000/profil.html
  - http://localhost:8000/wisata.html
  - http://localhost:8000/Layanan.html
  - http://localhost:8000/informasi.html

- Build: none (static site)
- Lint: none configured
- Tests: none present

High-level architecture and structure

- Pages and navigation
  - Top-level HTML files are the pages: index.html (landing), profil.html, wisata.html, Layanan.html, informasi.html, plus detail pages (e.g., berita_detail.html, agenda_detail.html) and facility/UMKM pages.
  - Navigation between pages is via standard anchor links; there is no client-side router.

- Styling
  - Shared and page-specific CSS lives under:
    - asset/css/ (e.g., profil-responsive.css, wisata.css)
    - asset2/css/ (landing/informasi styles)
    - asset3/CSS/ (layanan styles)

- JavaScript organization (no bundler; scripts are loaded directly by each HTML page)
  - Shared data and helpers: asset/js/global.js
    - Declares window.atraksiData, window.akomodasiData, window.kulinerData and formatPrice(). These arrays drive cards/modals across pages.
  - Landing page (index.html):
    - asset2/js/script.js powers animations, sticky nav, CTA, carousel modal, map/facility interactions, scroll-to-top, and hamburger overlay for this page style.
    - asset/js/index.js provides generic modal lifecycle (closeModal, Escape/outside-click handling), and sets WhatsApp target constants (ATRAKSI_WHATSAPP_NUMBER, AKOMODASI_WHATSAPP_NUMBER, KULINER_WHATSAPP_NUMBER, SEWA_WHATSAPP_NUMBER). It also defines a small (page-local) window.atraksiData used by index.
    - asset/js/wisata-objek.js manages "Objek Wisata" cards: builds/animates header slideshow inside a modal, rotates card images on hover, sets up intersection-based reveal animations. Uses dataset.slideInterval on the modal to track slideshow timers safely.
  - Profil page (profil.html):
    - asset/js/profil.js handles the 3D gallery carousel, timeline interactions (hover/click), section reveal on scroll, floating in-page nav with scrollspy and smooth scroll, awards modal/gallery, and a robust mobile hamburger menu (initializeHamburgerMenu). It also coordinates video modal playback.
    - asset2/js/script.js is also included here for shared UI effects.
  - Layanan page (Layanan.html):
    - asset3/JS/Layanan.js initializes page-specific UI: header tabs (Produk UMKM / Fasilitas), animations, scroll progress bar, ripple effects, and scroll-to-top.
  - Informasi page (informasi.html):
    - Uses asset2/js/script.js for animations and interactions, plus AOS/fontawesome via CDN.

- Data flow and DOM conventions
  - Most dynamic content is driven by in-repo arrays (window.atraksiData, window.akomodasiData, window.kulinerData) declared in asset/js/global.js.
  - Cards link to modals via data attributes (e.g., data-wisata-key). wisata-objek.js looks up entries in an internal wisataData map and populates the modal by ID (wisataModal) with images, title, location, features, and an optional sejarah paragraph.
  - Modals: A common closeModal() in asset/js/index.js closes any .modal element and clears any slideshow intervals saved on modal.dataset.slideInterval. Outside-click and Escape close are wired globally.

- Page wiring expectations (useful when editing/adding pages)
  - Ensure each page includes only the scripts it relies on (there’s no bundler that deduplicates). For example:
    - index.html: asset2/css/styles.css, asset/js/index.js, asset/js/wisata-objek.js, and any shared script/data it needs (asset/js/global.js if consuming shared data).
    - profil.html: asset/js/profil.js and (optionally) asset2/js/script.js.
    - Layanan.html: asset3/CSS/Layanan.css and asset3/JS/Layanan.js.
    - informasi.html: asset2/css/* and asset2/js/script.js.
  - When adding an attraction/accommodation/culinary item:
    - Append an entry in the respective array in asset/js/global.js.
    - Make sure the page markup uses the expected selectors/IDs and dataset keys consumed by the relevant script (e.g., .wisata-section .card with data-wisata-key matching wisataData in asset/js/wisata-objek.js, or that cards are built from window.atraksiData).
  - WhatsApp targets for actions are configured in asset/js/index.js via the window.*_WHATSAPP_NUMBER constants; update these to change CTA destinations.

Notes

- There are no CLAUDE, Cursor, or Copilot rule files in this repo.
- README.md currently contains only a title.
