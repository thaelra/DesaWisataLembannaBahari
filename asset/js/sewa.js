// Travel Agency & Rental Services JavaScript

// Service data for different rental types
// Service titles for modal
const serviceTitles = {
    mobil: "Rental Mobil",
    motor: "Rental Motor",
    perahu: "Rental Perahu",
    tourguide: "Layanan Tour Guide"
};

// Initialize travel agency functionality
function initTravelAgency() {
    // Add click event listeners to service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            openServiceModal(serviceType);
        });

        // Add hover animation
        item.addEventListener('mouseenter', () => {
            item.style.animation = 'pulse 1s infinite';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.animation = '';
        });
    });

    // Lihat Lebih Lanjut button functionality
    const lihatLebihLanjutBtn = document.getElementById('lihatLebihLanjut');
    if (lihatLebihLanjutBtn) {
        lihatLebihLanjutBtn.addEventListener('click', function() {
            openTravelAgencyModal();
        });
    }
    
    // Close modal when clicking the close button
    const closeBtn = document.getElementById('travelModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeServiceModal);
    }

    // Close modal when clicking outside the modal content
    const modal = document.getElementById('travelModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeServiceModal();
            }
        });
    }

    // Add escape key listener to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeServiceModal();
        }
    });
    
    // Close deskripsi modal when clicking the close button
    const deskripsiCloseBtn = document.getElementById('deskripsiModalClose');
    if (deskripsiCloseBtn) {
        deskripsiCloseBtn.addEventListener('click', closeDeskripsiModal);
    }
    
    // Close deskripsi modal when clicking outside the modal content
    const deskripsiModal = document.getElementById('deskripsiModal');
    if (deskripsiModal) {
        deskripsiModal.addEventListener('click', (e) => {
            if (e.target === deskripsiModal) {
                closeDeskripsiModal();
            }
        });
    }
    
    // Add escape key listener to close deskripsi modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && deskripsiModal && deskripsiModal.style.display === 'block') {
            closeDeskripsiModal();
        }
    });
}

// Open service modal with specific service type
function openServiceModal(serviceType) {
    const modal = document.getElementById('travelModal');
    const modalTitle = document.getElementById('modalServiceTitle');
    const servicesGrid = document.getElementById('servicesGrid');
    
    // Set modal title
    modalTitle.textContent = serviceTitles[serviceType] || 'Layanan Rental';
    
    // Clear previous content
    servicesGrid.innerHTML = '';
    
    // Get services for the selected type
    const services = rentalServices[serviceType] || [];
    
    // Create service cards
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        serviceCard.innerHTML = `
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}" onerror="this.src='asset2/WhatsApp Image 2025-08-20 at 18.48.36.png'">
            </div>
            <div class="service-details">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-features">
                    ${service.features.map(feature => `<span class="service-feature">${feature}</span>`).join('')}
                </div>
            </div>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
    
    // Show modal with animation
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Animate entrance
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('travelModal');
    if (modal) {
        modal.style.opacity = '0';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match the CSS transition time
    }
}

// Close service modal
function closeServiceModal() {
    closeModal(); // Reuse the closeModal function
}

// Open travel agency modal with full agency information
function openTravelAgencyModal() {
    const modal = document.getElementById('travelModal');
    const modalTitle = document.getElementById('modalServiceTitle');
    const servicesGrid = document.getElementById('servicesGrid');
    
    if (modal && modalTitle && servicesGrid) {
        modalTitle.textContent = 'Rezkyta Travel';
        
        // Create comprehensive agency description
        servicesGrid.innerHTML = `
            <div class="deskripsi-content">
                <img src="asset/img/wisata andalah/header-travel.jpeg" alt="Lembanna Travel & Rental" class="header-image">
                <h3>Tentang Kami</h3>
                <p>Rezkyta Travel adalah penyedia layanan transportasi dan wisata terpercaya di Desa Wisata Lembanna. Kami menawarkan berbagai pilihan kendaraan dan paket wisata yang dapat disesuaikan dengan kebutuhan Anda.</p>
                
                <h3>Layanan Kami</h3>
                <p>Kami menyediakan berbagai layanan untuk memenuhi kebutuhan wisata Anda:</p>
                <ul>
                    <li>Rental Mobil</li>
                    <li>Rental Motor</li>
                    <li>Rental Perahu</li>
                    <li>Jasa Tour Guide berpengalaman</li>
                    <li>Paket Wisata Lengkap</li>
                </ul>
                
                <h3>Keunggulan Kami</h3>
                <ul>
                    <li>Armada terawat dan terjamin kebersihannya</li>
                    <li>Driver dan tour guide berpengalaman dan ramah</li>
                    <li>Harga terjangkau dengan layanan premium</li>
                    <li>Fleksibel sesuai kebutuhan wisatawan</li>
                    <li>Dukungan 24/7 untuk bantuan darurat</li>
                </ul>
                <div class="agency-services">
                        <div class="service-item" data-service="mobil">
                            <div class="service-icon"><i class="fas fa-car"></i></div>
                            <span>Rental Mobil</span>
                        </div>
                        <div class="service-item" data-service="motor">
                            <div class="service-icon"><i class="fas fa-motorcycle"></i></div>
                            <span>Rental Motor</span>
                        </div>
                        <div class="service-item" data-service="perahu">
                            <div class="service-icon"><i class="fas fa-ship"></i></div>
                            <span>Rental Perahu</span>
                        </div>
                        <div class="service-item" data-service="tourguide">
                            <div class="service-icon"><i class="fas fa-map-marked-alt"></i></div>
                            <span>Tour Guide</span>
                        </div>
                    </div>
                    <div class="agency-features">
                        <div class="feature"><i class="fas fa-headset"></i> 24/7 Customer Service</div>
                        <div class="feature"><i class="fas fa-shield-alt"></i> Asuransi Lengkap</div>
                        <div class="feature"><i class="fas fa-user-tie"></i> Driver Berpengalaman</div>
                        <div class="feature"><i class="fas fa-hand-holding-usd"></i> Harga Terjangkau</div>
                    </div>
            </div>
            
    
            
           
        `;
        
        // Add click event to service cards
        const serviceCards = modal.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const serviceType = this.getAttribute('data-service');
                openServiceModal(serviceType);
            });
        });
        
        // Show modal with animation
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Animate entrance
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// Open deskripsi modal
function openDeskripsiModal() {
    const modal = document.getElementById('deskripsiModal');
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Animate entrance
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Close deskripsi modal
function closeDeskripsiModal() {
    const modal = document.getElementById('deskripsiModal');
    
    // Animate exit
    modal.style.opacity = '0';
    
    // Hide modal after animation
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }, 300);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTravelAgency);

// Add to global init function if it exists
if (typeof window.initWisata === 'function') {
    const originalInit = window.initWisata;
    window.initWisata = function() {
        try {
            originalInit();
        } catch (e) {
            console.log("Original init error handled:", e.message);
        }
        initTravelAgency();
    };
} else {
    // If initWisata doesn't exist, add event listener for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initTravelAgency);
}