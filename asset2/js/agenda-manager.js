// ===== AGENDA MANAGEMENT SYSTEM =====

class AgendaManager {
    constructor() {
        this.storageKey = 'agendaData';
        this.init();
    }

    // Initialize the agenda manager
    init() {
        this.bindFormEvents();
        this.loadAgendas();
        this.renderAgendas();
    }

    // Get all agendas from localStorage
    getAllAgendas() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Save agenda to localStorage
    saveAgenda(agendaData) {
        const agendas = this.getAllAgendas();
        const newAgenda = {
            id: this.generateId(),
            title: agendaData.title,
            category: agendaData.category,
            date: agendaData.date,
            description: agendaData.description,
            image: agendaData.image,
            imageFileName: agendaData.imageFileName,
            createdAt: new Date().toISOString()
        };
        
        agendas.push(newAgenda);
        localStorage.setItem(this.storageKey, JSON.stringify(agendas));
        return newAgenda;
    }

    // Delete agenda by ID
    deleteAgenda(id) {
        const agendas = this.getAllAgendas();
        const updatedAgendas = agendas.filter(agenda => agenda.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedAgendas));
        return true;
    }

    // Generate unique ID
    generateId() {
        return 'agenda_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Convert file to base64 for storage
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Bind form events
    bindFormEvents() {
        const form = document.querySelector('.agenda-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    // Handle form submission
    async handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Get form values
        const title = formData.get('agendaTitle');
        const category = formData.get('agendaCategory');
        const date = formData.get('agendaDate');
        const description = formData.get('agendaDescription');
        const imageFile = formData.get('agendaImage');
        
        // Validate required fields
        if (!title || !category || !date || !description || !imageFile.name) {
            this.showMessage('Semua field harus diisi!', 'error');
            return;
        }

        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Menyimpan...';
            submitBtn.disabled = true;

            // Convert image to base64
            const imageBase64 = await this.fileToBase64(imageFile);
            
            // Save agenda
            const agendaData = {
                title,
                category,
                date,
                description,
                image: imageBase64,
                imageFileName: imageFile.name
            };
            
            const savedAgenda = this.saveAgenda(agendaData);
            
            // Reset form
            form.reset();
            
            // Show success message
            this.showMessage('Agenda berhasil disimpan!', 'success');
            
            // Re-render agendas
            this.renderAgendas();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error('Error saving agenda:', error);
            this.showMessage('Gagal menyimpan agenda. Silakan coba lagi.', 'error');
            
            // Reset button
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Simpan Agenda';
            submitBtn.disabled = false;
        }
    }

    // Load agendas (for initialization)
    loadAgendas() {
        const agendas = this.getAllAgendas();
        console.log(`Loaded ${agendas.length} agendas from storage`);
        return agendas;
    }

    // Render agendas to the DOM
    renderAgendas() {
        const container = document.querySelector('.agenda-grid');
        if (!container) return;

        const agendas = this.getAllAgendas();
        
        // Sort agendas by date (newest first)
        agendas.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (agendas.length === 0) {
            container.innerHTML = `
                <div class="no-agenda-message">
                    <div class="no-agenda-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <h3>Belum Ada Agenda</h3>
                    <p>Silakan tambahkan agenda baru menggunakan formulir di atas.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        agendas.forEach((agenda, index) => {
            const agendaCard = this.createAgendaCard(agenda, index);
            container.appendChild(agendaCard);
        });
    }

    // Create agenda card element
    createAgendaCard(agenda, index) {
        const card = document.createElement('article');
        card.className = 'agenda-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        
        const dateObj = new Date(agenda.date);
        const day = dateObj.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                           'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        
        card.innerHTML = `
            <div class="agenda-date">
                <span class="date-number">${day}</span>
                <span class="date-month">${month}</span>
                <span class="date-year">${year}</span>
            </div>
            <div class="agenda-image">
                <img src="${agenda.image}" alt="${agenda.title}" loading="lazy">
                <div class="agenda-overlay">
                    <div class="overlay-content">
                        <i class="fas fa-eye"></i>
                        <span>Lihat Detail</span>
                    </div>
                </div>
            </div>
            <div class="agenda-content">
                <div class="agenda-meta">
                    <span class="agenda-category">
                        <i class="fas fa-tag"></i>
                        ${agenda.category}
                    </span>
                    <button class="delete-agenda-btn" data-agenda-id="${agenda.id}" title="Hapus Agenda">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h3 class="agenda-title">${agenda.title}</h3>
                <p class="agenda-description">${this.truncateText(agenda.description, 100)}</p>
                <div class="agenda-actions">
                    <button class="agenda-detail-btn" data-agenda-id="${agenda.id}">
                        <i class="fas fa-arrow-right"></i>
                        Lihat Detail
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const deleteBtn = card.querySelector('.delete-agenda-btn');
        const detailBtn = card.querySelector('.agenda-detail-btn');
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDeleteAgenda(agenda.id);
        });
        
        detailBtn.addEventListener('click', () => {
            this.openAgendaDetail(agenda);
        });
        
        // Make card clickable
        card.addEventListener('click', () => {
            this.openAgendaDetail(agenda);
        });
        
        return card;
    }

    // Truncate text for display
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Handle delete agenda
    handleDeleteAgenda(id) {
        if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
            this.deleteAgenda(id);
            this.showMessage('Agenda berhasil dihapus!', 'success');
            this.renderAgendas();
        }
    }

    // Open agenda detail (could be a modal or new page)
    openAgendaDetail(agenda) {
        // For now, create a simple modal
        this.showAgendaModal(agenda);
    }

    // Show agenda detail modal
    showAgendaModal(agenda) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('agendaDetailModal');
        if (!modal) {
            modal = this.createAgendaModal();
        }
        
        const dateObj = new Date(agenda.date);
        const formattedDate = dateObj.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modal.querySelector('.modal-image').src = agenda.image;
        modal.querySelector('.modal-image').alt = agenda.title;
        modal.querySelector('.modal-title').textContent = agenda.title;
        modal.querySelector('.modal-category').textContent = agenda.category;
        modal.querySelector('.modal-date').textContent = formattedDate;
        modal.querySelector('.modal-description').textContent = agenda.description;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Create agenda detail modal
    createAgendaModal() {
        const modal = document.createElement('div');
        modal.id = 'agendaDetailModal';
        modal.className = 'agenda-modal';
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Detail Agenda</h2>
                    <button class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-image-container">
                        <img class="modal-image" src="" alt="" loading="lazy">
                    </div>
                    <div class="modal-info">
                        <div class="modal-meta">
                            <span class="modal-category-wrapper">
                                <i class="fas fa-tag"></i>
                                <span class="modal-category"></span>
                            </span>
                            <span class="modal-date-wrapper">
                                <i class="fas fa-calendar"></i>
                                <span class="modal-date"></span>
                            </span>
                        </div>
                        <h3 class="modal-title"></h3>
                        <p class="modal-description"></p>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close-btn');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        document.body.appendChild(modal);
        return modal;
    }

    // Show message to user
    showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.agenda-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `agenda-message agenda-message-${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert after form
        const form = document.querySelector('.agenda-form');
        if (form) {
            form.parentNode.insertBefore(messageEl, form.nextSibling);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    // Export agenda data (bonus feature)
    exportAgendas() {
        const agendas = this.getAllAgendas();
        const dataStr = JSON.stringify(agendas, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `agenda_export_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import agenda data (bonus feature)
    importAgendas(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedAgendas = JSON.parse(event.target.result);
                    const existingAgendas = this.getAllAgendas();
                    const allAgendas = [...existingAgendas, ...importedAgendas];
                    localStorage.setItem(this.storageKey, JSON.stringify(allAgendas));
                    this.renderAgendas();
                    resolve(importedAgendas.length);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
}

// Initialize agenda manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the informasi page with agenda form
    if (document.querySelector('.agenda-form')) {
        window.agendaManager = new AgendaManager();
        console.log('Agenda Manager initialized');
    }
});