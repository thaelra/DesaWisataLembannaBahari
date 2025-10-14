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
    salonreng: {
         title: "Tari Salonreng",
    subtitle: "Tarian Tradisional dari Desa Ara",
    description: `
        <p><strong>Tari Salonreng</strong> merupakan tarian adat klasik yang telah berusia lebih dari <strong>400 tahun</strong> dan diwariskan secara turun-temurun oleh masyarakat Desa Ara. Tarian ini mencerminkan keanggunan, kehormatan, serta nilai-nilai budaya masyarakat Bugis-Makassar.</p>
        
        <h3>Sejarah dan Asal-usul</h3>
        <p>Tari Salonreng dibawa ke Ara oleh para bangsawan <strong>Kerajaan Gowa</strong> pada abad ke-17, ketika mereka menjalin kerja sama dengan masyarakat Ara untuk membangun perahu-perahu armada laut Gowa. Salah satu bangsawan yang memperkenalkan tarian ini adalah <strong>Karaeng Mamampang</strong>, yang kemudian menetap di Ara bersama keluarganya. Dari sinilah tarian ini berkembang dan menjadi identitas budaya masyarakat Ara.</p>
        <p>Kedudukan Tari Salonreng semakin kuat ketika keturunan Karaeng Mamampang menikah dengan bangsawan Ara, seperti <strong>Saloko Daeng Makatti</strong> yang menikah dengan <strong>Daeng Sikati Bunting Berua</strong>. Hubungan ini memperkuat posisi Salonreng sebagai warisan budaya bersama antara Gowa dan Ara.</p>
        
        <h3>Struktur dan Ragam Tarian</h3>
        <p>Dalam penampilannya, Tari Salonreng terdiri dari tiga bagian utama, yaitu:</p>
        <ul>
            <li><strong>Pakarena Lalo</strong> (atau <em>Akkarena Tedong</em>)</li>
            <li><strong>Siusiri</strong></li>
            <li><strong>Salonreng</strong> itu sendiri</li>
        </ul>
        <p>Setiap bagian memiliki makna dan irama gerakan yang berbeda, namun semuanya menggambarkan keanggunan dan kelembutan wanita Bugis-Makassar.</p>

        <h3>Kostum dan Musik Pengiring</h3>
        <p>Kostum yang digunakan oleh penari Salonreng terdiri dari <strong>Baju Bodo</strong>, <strong>sarung Samarinda</strong> atau <strong>sarung sutra</strong>, dan <strong>Tambong</strong> (selendang panjang berbentuk segitiga). Jumlah penari selalu <strong>genap</strong> karena setiap gerakan dibawakan secara berpasangan, menggambarkan harmoni dan keseimbangan. Tarian ini diiringi oleh alat musik tradisional seperti <strong>gong</strong> dan <strong>gendang</strong> yang mengatur tempo dan suasana selama pertunjukan.</p>

        <h3>Makna dan Nilai Filosofis</h3>
        <p>Tari Salonreng memiliki makna mendalam tentang <strong>keindahan, perangai, dan keharmonisan</strong>. Ia melambangkan ajaran untuk <strong>menerima kebaikan dan meninggalkan keburukan</strong>, menjaga <strong>norma dan kesopanan</strong>, serta memperlihatkan kesatuan antara <strong>pemerintah atau penguasa dengan masyarakat</strong>. Tarian ini menjadi simbol persatuan dan keseimbangan dalam kehidupan sosial dan spiritual masyarakat Ara.</p>
        
        <h3>Peran dalam Sejarah</h3>
        <p>Berdasarkan catatan <em>lontara</em> di Ara, Tari Salonreng sering dipentaskan untuk menghibur para bangsawan Gowa dan Ara saat menunggu selesainya pembuatan perahu. Tarian ini bahkan pernah ditampilkan di hadapan <strong>Sultan Hasanuddin</strong> saat singgah di Tanah Beru sebelum berangkat berperang ke Buton.</p>
        <p>Tercatat pula bahwa tarian ini pernah diundang oleh <strong>Raja Bone ke-XXIII, La Tenritappu</strong>, dan dipentaskan di Baruga Bone pada <strong>20–21 September 1793</strong>. Fakta ini menunjukkan nilai diplomasi budaya dan sejarah yang melekat pada Tari Salonreng.</p>
        
        <h3>Pertunjukan</h3>
        <p>Tari Salonreng sering ditampilkan dalam acara adat, penyambutan tamu kehormatan, serta festival budaya di wilayah Ara dan sekitarnya. Tarian ini menjadi simbol kebanggaan masyarakat Ara atas warisan budaya yang telah bertahan selama berabad-abad.</p>

        <h3>QR CODE Sejarah Lengkap</h3>
        <img src="asset/img/wisata andalah/QR_CODE_TARISALONRENG.jpeg" alt="QR Code Sejarah Salonreng">
    `,
    image: "asset/img/wisata andalah/tarian-salonreng.jpeg"
    },
   pattoengang: {
    title: "Pattoengang",
    subtitle: "Tradisi Ayunan Masyarakat Ara Lembanna",
    description: `
        <p><strong>Pattoengang</strong> adalah sebuah kekayaan budaya Ara Lembanna yang pernah mengalami puncak keemasannya dengan meninggalkan kenangan manis. Kenangan yang ditandai dengan banyaknya keinginan untuk memunculkan kembali budaya ini di tengah-tengah masyarakat pemiliknya adalah sebuah harapan yang senantiasa membuncah di puncak keinginannya. Pattoengang sebagai ajang silaturrahmi sesungguhnya mengandung makna yang sangat dalam bagi masyarakat yang pernah menyaksikannya secara langsung ataupun pelaku dan pelaksana dari tradisi leluhur ini, lebih-lebih lagi bagi warga yang hanya mendengarkan dari kisah-kisah leluhurnya lewat cerita lisan yang didendangkan oleh kakek nenek dengan cerita berbumbu kenangan.</p>
        
        <h3>Sejarah Penamaan</h3>
        <p>Pattoengang dari sisi bahasa berarti arena berayun yang mencerminkan kegembiraan seluruh masyarakat pendukungnya. Pattoengang sendiri berakar dari kata <strong>PATTOENG</strong> yang artinya ayunan dan <strong>ANGGANG</strong> yang berarti ayunan yang inti pelaksanaannya adalah berayun-ayun dengan cara tertentu sesuai adat kebiasaan pendukungnya. Permainan ini selalu menjadi hal yang pada masa lalu dinantikan oleh kaum remaja baik perempuan maupun laki-laki dengan berbagai motif keikutsertaannya dalam arena ayun berayun yang bertitel Pattoengang. Pelaksanaannya sendiri kebanyakan dilakukan pada saat musim kemarau tiba kecuali untuk pelaksanaan hajat-hajat tertentu oleh masyarakat.

       <h3>Latar Belakang Sosial dan Budayanya</h3>
       <p>Pada mulanya, permainan ini adalah sebuah ritual untuk mengenang turunnya manusia pertama di bumi Bugis Makassar yakni <strong>Batara Guru</strong> yang diturunkan ke bumi menggunakan <stong>toeng bulaeng</stong> atau ayunan emas. 
       <strong>Batara Guru</strong> sendiri akhirnya menurunkan generasi penguasa Sulawesi Selatan termasuk <strong>Sawerigading</strong>, seorang tokoh legendaris asal Tanah Luwu yang fenomenal hingga kini. 
       <strong>Sawerigading</strong> sendiri dengan orang-orang Ara memiliki ikatan emosional sebagai sosok yang pertama kali mengajarkan orang-orang Ara membuat perahu dengan segala bumbu mitos yang mengiringinya. 
       Dengan demikian, ikatan emosional melahirkan keinginan kolektif untuk mengabadikan ikatan ini dalam sebuah tradisi yang dinamakan Pattoengang. Kegiatan ini terus dilanjutkan oleh masyarakat Ara Lembanna sebagai sebuah tradisi yang pada masa perkembangannya 
       bukan lagi sebagai ritual tetapi sebagai hal yang profan berbentuk kegembiraan seperti pesta perkawinan, mendorong perahu, upacara kelahiran, pencarian jodoh, dan lain-lain. Sebagai sebuah permainan kolektif dan melembaga di masyarakat pada zamannya, 
       permainan ini telah menyimpan memori yang sangat dalam akan puncak-puncak keemasannya dengan pelaksanaan yang begitu meriah. Sampai saat ini, memori masyarakat Ara Lembanna mengenang tiga peristiwa penting yang menjadi puncak terbaik dalam pelaksanaannya.
       </p>
        <h3>Pelaksanaan Terbaik</h3>
        <ul>
            <li><strong>Lembanna (1936):</strong> Diselenggarakan bersamaan dengan pertunjukan komedi oleh Residen Belanda, berlangsung selama sebulan penuh.</li>
            <li><strong>Bontona (1946):</strong> Dipadu dengan tradisi Safar, Pattoengang paling lengkap dan meriah, dipimpin Bungko Atok.</li>
            <li><strong>Tinaung (1947):</strong> Dilaksanakan keluarga Ballo Daeng Mangulisi, dengan bintang utama Tasa Demmamempo.</li>
        </ul>

        <h3>Peralatan & Jalannya Permainan</h3>
        <ul>
            <li>Gadis duduk di <em>empogang</em> atau dudukan, dengan pengaman <em>panggepek</em>.</li>
            <li>Ayunan digantung pada pohon atau balok setinggi minimal 10 meter, tali disebut <em>lambero</em>.</li>
            <li><em>Palambero</em> menarik tali, melepaskannya dengan gerakan <em>ajjae</em>, ditutup tari <em>salonreng</em>.</li>
        </ul>

        <h3>Tujuan</h3>
        <ul>
            <li>Melestarikan tradisi budaya lokal</li>
            <li>Meningkatkan kecintaan masyarakat pada kampung</li>
            <li>Menjadikan Pattoengang event tahunan</li>
        </ul>
    `,
    image: "asset/img/wisata andalah/pattoengang-1.jpeg"
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