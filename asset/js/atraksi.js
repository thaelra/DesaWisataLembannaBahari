/**
 * Atraksi Wisata Section JavaScript
 * Handles scroll animations and interactions for cultural attractions
 */

// Intersection Observer for scroll animations
function initAtraksiAnimations() {
    const atraksiItems = document.querySelectorAll('.atraksi-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    atraksiItems.forEach(item => {
        observer.observe(item);
    });
}

// Detailed information for each atraksi
const atraksiData = {
    assulo: {
        title: "Assulo Juk'u",
        subtitle: "Ritual Tradisional Nelayan Bugis Makassar",
        description: `
            <p><strong>Assulo Juk'u</strong> adalah ritual sakral yang telah dilakukan turun-temurun oleh masyarakat nelayan Bugis Makassar di Desa Lembanna. Upacara ini dilaksanakan sebagai bentuk rasa syukur kepada Sang Pencipta dan permohonan keselamatan sebelum para nelayan melaut.</p>
            
            <h3>Makna dan Filosofi</h3>
            <p>Ritual ini mencerminkan kearifan lokal masyarakat pesisir yang sangat menghargai laut sebagai sumber kehidupan. Melalui Assulo Juk'u, masyarakat mengajarkan nilai-nilai spiritual dan keseimbangan dengan alam.</p>
            
            <h3>Prosesi Ritual</h3>
            <ul>
                <li>Pembacaan doa-doa tradisional</li>
                <li>Penyajian sesaji khas masyarakat pesisir</li>
                <li>Prosesi ke tepi pantai</li>
                <li>Pelepasan perahu dengan harapan keselamatan</li>
            </ul>
            
            <h3>Waktu Pelaksanaan</h3>
            <p>Ritual ini dilakukan pada awal musim melaut, biasanya setelah musim angin barat berakhir dan laut kembali tenang.</p>
            
            <h3>Nilai Budaya</h3>
            <p>Assulo Juk'u menjadi bukti nyata bagaimana masyarakat Lembanna menjaga tradisi nenek moyang sambil tetap menjalankan kehidupan modern sebagai desa wisata.</p>
        `,
        image: "asset/img/profil-desa/Assulo Juk'u di Mandala Ria.jpg"
    },
    pinisi: {
        title: "Warisan Pembuatan Perahu Pinisi",
        subtitle: "UNESCO Intangible Cultural Heritage",
        description: `
            <p><strong>Pembuatan Perahu Pinisi</strong> adalah seni kerajinan kapal tradisional yang telah diakui UNESCO sebagai warisan budaya takbenda manusia. Desa Lembanna memiliki sejarah panjang dalam tradisi pembuatan kapal legendaris ini.</p>
            
            <h3>Pengakuan UNESCO</h3>
            <p>Pada tahun 2017, UNESCO secara resmi mengakui pembuatan perahu Pinisi sebagai warisan budaya takbenda yang harus dilestarikan. Ini menempatkan tradisi Bugis-Makassar setara dengan warisan budaya dunia lainnya.</p>
            
            <h3>Teknik Pembuatan</h3>
            <ul>
                <li>Tanpa menggunakan gambar teknik formal</li>
                <li>Pengetahuan turun-temurun dari generasi ke generasi</li>
                <li>Pemilihan kayu khusus dengan ritual tersendiri</li>
                <li>Proses pembuatan bisa memakan waktu berbulan-bulan</li>
                <li>Setiap detail memiliki makna filosofis</li>
            </ul>
            
            <h3>Keunikan Pinisi</h3>
            <p>Perahu Pinisi bukan sekadar kapal, tetapi simbol ketangguhan dan jiwa petualang masyarakat Bugis-Makassar. Kapal ini mampu berlayar hingga ke berbagai negara, membuktikan kecanggihan teknologi maritim nusantara.</p>
            
            <h3>Pelestarian Tradisi</h3>
            <p>Desa Lembanna aktif dalam upaya pelestarian pengetahuan pembuatan Pinisi, termasuk mengadakan workshop dan demonstrasi untuk generasi muda dan wisatawan.</p>
        `,
        image: "asset/img/profil-desa/penghargaan-unesco.png"
    },
    pakarena: {
        title: "Tari Pakarena",
        subtitle: "Tarian Klasik Bugis-Makassar",
        description: `
            <p><strong>Tari Pakarena</strong> adalah tarian klasik yang mencerminkan keanggunan dan kesopanan wanita Bugis-Makassar. Setiap gerakan dalam tarian ini sarat dengan makna filosofis dan nilai-nilai luhur.</p>
            
            <h3>Sejarah dan Asal-usul</h3>
            <p>Konon, Tari Pakarena berasal dari kisah bidadari kahyangan yang turun ke bumi. Gerakan-gerakannya yang lemah gemulai mencerminkan keanggunan dan kelemahlembutan yang menjadi ciri khas wanita Bugis.</p>
            
            <h3>Karakteristik Gerakan</h3>
            <ul>
                <li>Gerakan tangan yang lembut dan terukur</li>
                <li>Langkah kaki yang halus dan sopan</li>
                <li>Pandangan mata yang rendah, menunjukkan kesopanan</li>
                <li>Penggunaan kipas sebagai properti utama</li>
                <li>Irama yang mengikuti musik tradisional</li>
            </ul>
            
            <h3>Makna Filosofis</h3>
            <p>Setiap gerakan dalam Tari Pakarena mengandung makna mendalam tentang nilai-nilai kesopanan, kerendahan hati, dan keanggunan yang harus dimiliki seorang wanita dalam budaya Bugis-Makassar.</p>
            
            <h3>Kostum dan Musik</h3>
            <p>Penari mengenakan baju bodo, pakaian tradisional khas Bugis-Makassar, dengan warna-warna yang melambangkan strata sosial. Musik pengiring menggunakan alat musik tradisional seperti gendang, suling, dan kecapi.</p>
            
            <h3>Pertunjukan</h3>
            <p>Tari Pakarena sering ditampilkan dalam acara-acara adat, penyambutan tamu kehormatan, dan festival budaya di Desa Lembanna.</p>
        `,
        image: "asset/img/profil-desa/WhatsApp Image 2025-09-13 at 09.48.45 (1).jpeg"
    },
    festival: {
        title: "Festival Bahari Lembanna",
        subtitle: "Perayaan Budaya Maritim Tahunan",
        description: `
            <p><strong>Festival Bahari Lembanna</strong> adalah acara tahunan yang memadukan berbagai kegiatan maritim, budaya, dan wisata. Festival ini menjadi ajang memperkenalkan kekayaan budaya dan potensi wisata Desa Lembanna.</p>
            
            <h3>Rangkaian Acara</h3>
            <ul>
                <li><strong>Lomba Perahu Tradisional:</strong> Kompetisi antar desa dengan perahu khas Bugis-Makassar</li>
                <li><strong>Pameran Hasil Laut:</strong> Showcase produk-produk unggulan masyarakat pesisir</li>
                <li><strong>Kuliner Nusantara:</strong> Festival makanan khas dengan menu-menu seafood tradisional</li>
                <li><strong>Pertunjukan Seni:</strong> Tari Pakarena, musik tradisional, dan seni budaya lainnya</li>
                <li><strong>Kompetisi Fotografi:</strong> Menangkap momen keindahan Lembanna</li>
                <li><strong>Seminar Maritim:</strong> Diskusi tentang konservasi laut dan pengembangan pariwisata</li>
            </ul>
            
            <h3>Tujuan Festival</h3>
            <p>Festival ini bertujuan untuk:</p>
            <ul>
                <li>Melestarikan budaya maritim lokal</li>
                <li>Meningkatkan kesadaran akan pentingnya konservasi laut</li>
                <li>Mempromosikan potensi wisata Desa Lembanna</li>
                <li>Memberdayakan ekonomi kreatif masyarakat</li>
                <li>Mempererat tali silaturahmi antar komunitas</li>
            </ul>
            
            <h3>Waktu Pelaksanaan</h3>
            <p>Festival Bahari Lembanna biasanya diselenggarakan pada pertengahan tahun, bertepatan dengan musim kemarau ketika cuaca laut sedang bersahabat.</p>
            
            <h3>Partisipasi</h3>
            <p>Festival ini terbuka untuk umum dan melibatkan seluruh lapisan masyarakat, dari anak-anak hingga dewasa, wisatawan lokal maupun mancanegara.</p>
        `,
        image: "asset/img/profil-desa/WhatsApp Image 2025-09-13 at 09.48.45 (4).jpeg"
    }
};

// Show detailed modal for specific atraksi
function showAtraksiDetail(atraksiKey) {
    const data = atraksiData[atraksiKey];
    
    if (!data) {
        console.error('Atraksi data not found:', atraksiKey);
        return;
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="atraksi-modal" id="atraksiModal">
            <div class="atraksi-modal-overlay" onclick="closeAtraksiModal()"></div>
            <div class="atraksi-modal-content">
                <button class="atraksi-modal-close" onclick="closeAtraksiModal()" aria-label="Tutup">
                    <i class="fas fa-times"></i>
                </button>
                <div class="atraksi-modal-header">
                    <img src="${data.image}" alt="${data.title}" class="atraksi-modal-image">
                    <div class="atraksi-modal-title-wrapper">
                        <h2 class="atraksi-modal-title">${data.title}</h2>
                        <p class="atraksi-modal-subtitle">${data.subtitle}</p>
                    </div>
                </div>
                <div class="atraksi-modal-body">
                    ${data.description}
                </div>
                <div class="atraksi-modal-footer">
                    <button class="atraksi-modal-btn" onclick="closeAtraksiModal()">Tutup</button>
                    <button class="atraksi-modal-btn atraksi-modal-btn-primary" onclick="contactForBooking('${data.title}')">
                        <i class="fas fa-phone"></i> Hubungi Kami
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        const modal = document.getElementById('atraksiModal');
        if (modal) {
            modal.classList.add('active');
        }
    }, 10);
}

// Close modal
function closeAtraksiModal() {
    const modal = document.getElementById('atraksiModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Remove modal after animation
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Contact for booking
function contactForBooking(atraksiName) {
    const message = `Halo, saya tertarik untuk mengetahui lebih lanjut tentang ${atraksiName}. Bisakah Anda memberikan informasi lebih detail?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '6282191234567'; // Replace with actual WhatsApp number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAtraksiModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAtraksiAnimations();
});

// Also initialize when section becomes visible (for dynamic loading)
if (typeof window.initAtraksi === 'undefined') {
    window.initAtraksi = initAtraksiAnimations;
}