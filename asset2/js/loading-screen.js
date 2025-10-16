/**
 * Loading Screen Controller for Desa Wisata Andalan - Lembanna
 */

class LoadingScreen {
    constructor() {
        this.loadingMessages = [
            'Memuat keindahan pantai Mandala Ria...',
            'Menyiapkan pesona tebing Batu Tongkarayya...',
            'Menghadirkan kemegahan tebing Mattoanging...',
            'Menjelajahi misteri Gua Purbakala Passea...',
            'Selamat datang di Desa Wisata Lembanna...'
        ];
        this.currentMessageIndex = 0;
        this.messageInterval = null;
        this.minLoadingTime = 1000; // Minimum loading time (1.5 seconds)
        this.startTime = Date.now();
    }

    // Create loading screen HTML structure
    createLoadingScreen() {
        const loadingHTML = `
            <div class="loading-screen" id="loadingScreen">
                <!-- Animated Background Waves -->
                <div class="loading-waves">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                </div>

                <!-- Floating Particles -->
                <div class="loading-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>

                <!-- Loading Content -->
                <div class="loading-content">
                    <!-- Logo with Animation -->
                    <div class="loading-logo">
                        <img id="loadingLogoImg" src="asset/img/profil-desa/logo-1.jpeg" alt="Logo Desa Lembanna" onerror="this.onerror=null; this.src='asset/img/profil-desa/logo-1.jpeg';">
                    </div>

                    <!-- Loading Text -->
                    <h1 class="loading-title">Desa Wisata Andalan</h1>
                    <p class="loading-subtitle">Lembanna • Kabupaten Bulukumba • Sulawesi Selatan</p>

                    <!-- Loading Progress Dots -->
                    <div class="loading-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>

                <!-- Loading Message -->
                <div class="loading-message" id="loadingMessage">
                    Memuat keindahan Desa Lembanna...
                </div>
            </div>
        `;

        // Insert loading screen at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    // Update loading message with animation
    updateMessage() {
        const messageElement = document.getElementById('loadingMessage');
        if (messageElement && this.currentMessageIndex < this.loadingMessages.length) {
            messageElement.style.opacity = '0';
            
            setTimeout(() => {
                messageElement.textContent = this.loadingMessages[this.currentMessageIndex];
                messageElement.style.opacity = '1';
                this.currentMessageIndex++;
            }, 200);
        }
    }

    // Start loading screen
    show() {
        // Create the loading screen
        this.createLoadingScreen();

        // Start message rotation
        this.messageInterval = setInterval(() => {
            this.updateMessage();
        }, 400);

        // Ensure body doesn't scroll while loading
        document.body.style.overflow = 'hidden';
    }

    // Hide loading screen with animation
    hide() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);

        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                // Clear message interval
                if (this.messageInterval) {
                    clearInterval(this.messageInterval);
                }

                // Add fade out class
                loadingScreen.classList.add('fade-out');

                // Remove loading screen after transition
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                    // Restore body scroll
                    document.body.style.overflow = '';
                }, 800);
            }
        }, remainingTime);
    }

    // Initialize loading screen
    init() {
        // Show loading screen immediately
        this.show();

        // Hide loading screen when page is fully loaded
        if (document.readyState === 'complete') {
            this.hide();
        } else {
            window.addEventListener('load', () => {
                this.hide();
            });
        }
    }
}

// Auto-initialize loading screen when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = new LoadingScreen();
    loadingScreen.init();
});

// Fallback for very slow connections - force hide after 10 seconds
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
            document.body.style.overflow = '';
        }, 600);
    }
}, 10000);