/**
 * Enhanced Agenda Management System
 * Features: CRUD operations, file handling, statistics, validation
 */

class EnhancedAgendaManager {
    constructor() {
        this.storageKey = 'enhanced_agenda_data';
        this.currentEditId = null;
        this.init();
    }

    // Initialize the system
    init() {
        this.bindEvents();
        this.loadAgendas();
        this.updateStatistics();
        this.renderAgendaList();
        this.setupImagePreview();
        this.setMinDate();
        this.handleURLParams();
    }

    // Set minimum date to today
    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').setAttribute('min', today);
    }

    // Handle URL parameters for direct editing
    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        const tab = urlParams.get('tab');
        
        // Switch to the specified tab
        if (tab) {
            this.switchTab(tab);
        }
        
        // Handle edit request
        if (editId) {
            const agendas = this.getAgendas();
            const agenda = agendas.find(a => a.id === editId);
            if (agenda) {
                this.editAgenda(agenda);
                this.showMessage('Agenda siap untuk diedit!', 'success');
            } else {
                this.showMessage('Agenda tidak ditemukan!', 'error');
            }
        }

        // Check for stored edit ID (from informasi.html redirect)
        const storedEditId = localStorage.getItem('edit_agenda_id');
        if (storedEditId && !editId) {
            const agendas = this.getAgendas();
            const agenda = agendas.find(a => a.id === storedEditId);
            if (agenda) {
                this.switchTab('add');
                this.editAgenda(agenda);
                this.showMessage('Agenda siap untuk diedit!', 'success');
            }
            localStorage.removeItem('edit_agenda_id');
        }
    }

    // Bind all event listeners
    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submission
        document.getElementById('agendaForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => this.resetForm());

        // Image input change
        document.getElementById('image').addEventListener('change', (e) => this.handleImageChange(e));

        // Custom category input
        document.getElementById('category').addEventListener('change', (e) => this.handleCategoryChange(e));
    }

    // Handle category change for custom input
    handleCategoryChange(event) {
        const categorySelect = event.target;
        if (categorySelect.value === 'Lainnya') {
            const customInput = document.createElement('input');
            customInput.type = 'text';
            customInput.id = 'customCategory';
            customInput.name = 'customCategory';
            customInput.placeholder = 'Masukkan kategori kustom';
            customInput.className = categorySelect.className;
            customInput.required = true;
            
            categorySelect.parentNode.appendChild(customInput);
            customInput.focus();
            
            customInput.addEventListener('blur', () => {
                if (customInput.value.trim()) {
                    // Add the custom category as an option
                    const option = document.createElement('option');
                    option.value = customInput.value.trim();
                    option.textContent = customInput.value.trim();
                    categorySelect.insertBefore(option, categorySelect.lastElementChild);
                    categorySelect.value = customInput.value.trim();
                }
                customInput.remove();
            });
        }
    }

    // Setup image preview functionality
    setupImagePreview() {
        const imageInput = document.getElementById('image');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    this.showMessage('Ukuran file terlalu besar. Maksimal 5MB.', 'error');
                    imageInput.value = '';
                    preview.style.display = 'none';
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    this.showMessage('File harus berupa gambar.', 'error');
                    imageInput.value = '';
                    preview.style.display = 'none';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }

    // Handle image input change
    handleImageChange(event) {
        const file = event.target.files[0];
        const label = document.querySelector('.file-upload-label');
        const textDiv = label.querySelector('.file-upload-text div');
        
        if (file) {
            textDiv.textContent = `File dipilih: ${file.name}`;
            label.style.borderColor = 'var(--primary-color)';
            label.style.background = 'white';
        } else {
            textDiv.textContent = 'Klik untuk pilih gambar';
            label.style.borderColor = 'rgba(19, 62, 135, 0.3)';
            label.style.background = '#f8fbff';
        }
    }

    // Switch between tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab contents
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Reset form when switching to add tab
        if (tabName === 'add') {
            this.resetForm();
        }

        // Refresh list when switching to list tab
        if (tabName === 'list') {
            this.renderAgendaList();
        }
    }

    // Handle form submission
    async handleFormSubmit(event) {
        event.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

        try {
            const formData = new FormData(event.target);
            const imageFile = formData.get('image');

            // Validate all required fields
            const title = formData.get('title').trim();
            const category = formData.get('category') || formData.get('customCategory');
            const date = formData.get('date');
            const description = formData.get('description').trim();

            if (!title || !category || !date || !description) {
                throw new Error('Semua field harus diisi!');
            }

            // Handle image
            let imageBase64 = null;
            let imageFileName = null;

            if (imageFile && imageFile.size > 0) {
                imageBase64 = await this.fileToBase64(imageFile);
                imageFileName = imageFile.name;
            } else if (this.currentEditId) {
                // Keep existing image if editing and no new image selected
                const existingAgenda = this.getAgendaById(this.currentEditId);
                if (existingAgenda) {
                    imageBase64 = existingAgenda.image;
                    imageFileName = existingAgenda.imageFileName;
                }
            } else {
                throw new Error('Gambar harus dipilih!');
            }

            const agendaData = {
                title,
                category,
                date,
                description,
                image: imageBase64,
                imageFileName
            };

            // Save or update agenda
            if (this.currentEditId) {
                this.updateAgenda(this.currentEditId, agendaData);
                this.showMessage('Agenda berhasil diperbarui!', 'success');
            } else {
                this.saveAgenda(agendaData);
                this.showMessage('Agenda berhasil ditambahkan!', 'success');
            }

            // Reset form and update UI
            this.resetForm();
            this.updateStatistics();
            this.renderAgendaList();

        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Get all agendas from localStorage
    getAllAgendas() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Get agenda by ID
    getAgendaById(id) {
        const agendas = this.getAllAgendas();
        return agendas.find(agenda => agenda.id === id);
    }

    // Save new agenda
    saveAgenda(agendaData) {
        const agendas = this.getAllAgendas();
        const newAgenda = {
            id: this.generateId(),
            ...agendaData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        agendas.push(newAgenda);
        localStorage.setItem(this.storageKey, JSON.stringify(agendas));
        this.triggerDataChangeEvent('add', newAgenda);
        return newAgenda;
    }

    // Update existing agenda
    updateAgenda(id, agendaData) {
        const agendas = this.getAllAgendas();
        const index = agendas.findIndex(agenda => agenda.id === id);
        
        if (index !== -1) {
            agendas[index] = {
                ...agendas[index],
                ...agendaData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(agendas));
            this.triggerDataChangeEvent('update', agendas[index]);
            return agendas[index];
        }
        return null;
    }

    // Delete agenda
    deleteAgenda(id) {
        const agendas = this.getAllAgendas();
        const deletedAgenda = agendas.find(agenda => agenda.id === id);
        const updatedAgendas = agendas.filter(agenda => agenda.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedAgendas));
        if (deletedAgenda) {
            this.triggerDataChangeEvent('delete', deletedAgenda);
        }
        return true;
    }

    // Generate unique ID
    generateId() {
        return 'agenda_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Trigger custom event for data changes
    triggerDataChangeEvent(action, agenda) {
        // Dispatch custom event for real-time synchronization
        const event = new CustomEvent('agendaDataChanged', {
            detail: {
                action: action, // 'add', 'update', 'delete'
                agenda: agenda,
                timestamp: new Date().toISOString(),
                totalCount: this.getAllAgendas().length
            }
        });
        
        window.dispatchEvent(event);
        console.log(`📅 Agenda ${action}:`, agenda.title);
        
        // Also trigger a storage event manually for cross-tab communication
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.storageKey,
            newValue: localStorage.getItem(this.storageKey),
            url: window.location.href
        }));
    }

    // Load agendas (placeholder for potential server integration)
    loadAgendas() {
        const agendas = this.getAllAgendas();
        console.log(`Loaded ${agendas.length} agendas from localStorage`);
        return agendas;
    }

    // Update statistics
    updateStatistics() {
        const agendas = this.getAllAgendas();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Total agendas
        document.getElementById('totalAgendas').textContent = agendas.length;

        // Upcoming agendas (from today onwards)
        const upcoming = agendas.filter(agenda => new Date(agenda.date) >= now).length;
        document.getElementById('upcomingAgendas').textContent = upcoming;

        // This month agendas
        const thisMonth = agendas.filter(agenda => {
            const agendaDate = new Date(agenda.date);
            return agendaDate >= startOfMonth && agendaDate <= endOfMonth;
        }).length;
        document.getElementById('thisMonthAgendas').textContent = thisMonth;
    }

    // Render agenda list in table
    renderAgendaList() {
        const tbody = document.getElementById('agendaTableBody');
        const agendas = this.getAllAgendas();

        // Sort by date (newest first)
        agendas.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (agendas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-calendar-alt" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                        <p style="color: #666;">Belum ada agenda yang ditambahkan.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = agendas.map(agenda => {
            const agendaDate = new Date(agenda.date);
            const now = new Date();
            const status = agendaDate >= now ? 
                '<span style="color: #28a745; font-weight: 600;">Mendatang</span>' : 
                '<span style="color: #6c757d;">Selesai</span>';

            const formattedDate = agendaDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            return `
                <tr>
                    <td>
                        <img src="${agenda.image}" alt="${agenda.title}" class="agenda-thumbnail">
                    </td>
                    <td>
                        <strong>${agenda.title}</strong>
                        <br>
                        <small style="color: #666;">${this.truncateText(agenda.description, 50)}</small>
                    </td>
                    <td>
                        <span style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">
                            ${agenda.category}
                        </span>
                    </td>
                    <td>${formattedDate}</td>
                    <td>${status}</td>
                    <td>
                        <div class="agenda-actions">
                            <button class="action-btn edit" onclick="agendaManager.editAgenda('${agenda.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="agendaManager.confirmDeleteAgenda('${agenda.id}')" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Truncate text for display
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Edit agenda
    editAgenda(id) {
        const agenda = this.getAgendaById(id);
        if (!agenda) {
            this.showMessage('Agenda tidak ditemukan!', 'error');
            return;
        }

        // Switch to add tab
        this.switchTab('add');

        // Populate form
        document.getElementById('editingId').value = id;
        document.getElementById('title').value = agenda.title;
        document.getElementById('category').value = agenda.category;
        document.getElementById('date').value = agenda.date;
        document.getElementById('description').value = agenda.description;

        // Show existing image
        if (agenda.image) {
            document.getElementById('previewImg').src = agenda.image;
            document.getElementById('imagePreview').style.display = 'block';
        }

        // Update form title and button
        document.getElementById('formTitle').textContent = 'Edit Agenda';
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Perbarui Agenda';

        // Make image optional for editing
        document.getElementById('image').removeAttribute('required');

        this.currentEditId = id;
    }

    // Confirm delete agenda
    confirmDeleteAgenda(id) {
        const agenda = this.getAgendaById(id);
        if (!agenda) {
            this.showMessage('Agenda tidak ditemukan!', 'error');
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus agenda "${agenda.title}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
            this.deleteAgenda(id);
            this.showMessage('Agenda berhasil dihapus!', 'success');
            this.updateStatistics();
            this.renderAgendaList();
        }
    }

    // Reset form to default state
    resetForm() {
        document.getElementById('agendaForm').reset();
        document.getElementById('editingId').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('formTitle').textContent = 'Tambah Agenda Baru';
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Simpan Agenda';
        document.getElementById('image').setAttribute('required', 'required');
        
        // Reset file upload label
        const label = document.querySelector('.file-upload-label');
        const textDiv = label.querySelector('.file-upload-text div');
        textDiv.textContent = 'Klik untuk pilih gambar';
        label.style.borderColor = 'rgba(19, 62, 135, 0.3)';
        label.style.background = '#f8fbff';

        this.currentEditId = null;
        this.clearMessages();
    }

    // Show message to user
    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        
        // Clear existing messages
        container.innerHTML = '';
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        messageEl.innerHTML = `
            <i class="fas ${icon}"></i>
            ${message}
        `;
        
        container.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);

        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Clear all messages
    clearMessages() {
        document.getElementById('messageContainer').innerHTML = '';
    }

    // Export agendas to JSON (for backup)
    exportAgendas() {
        const agendas = this.getAllAgendas();
        const dataStr = JSON.stringify(agendas, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `agenda_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import agendas from JSON file
    importAgendas(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!Array.isArray(importedData)) {
                    throw new Error('Format file tidak valid');
                }

                // Merge with existing data
                const existingAgendas = this.getAllAgendas();
                const mergedAgendas = [...existingAgendas, ...importedData];
                
                localStorage.setItem(this.storageKey, JSON.stringify(mergedAgendas));
                
                this.updateStatistics();
                this.renderAgendaList();
                this.showMessage(`Berhasil mengimpor ${importedData.length} agenda!`, 'success');
                
            } catch (error) {
                this.showMessage('Gagal mengimpor file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Search and filter agendas
    searchAgendas(query) {
        const agendas = this.getAllAgendas();
        return agendas.filter(agenda => 
            agenda.title.toLowerCase().includes(query.toLowerCase()) ||
            agenda.description.toLowerCase().includes(query.toLowerCase()) ||
            agenda.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filter agendas by date range
    filterByDateRange(startDate, endDate) {
        const agendas = this.getAllAgendas();
        return agendas.filter(agenda => {
            const agendaDate = new Date(agenda.date);
            return agendaDate >= new Date(startDate) && agendaDate <= new Date(endDate);
        });
    }

    // Get upcoming agendas
    getUpcomingAgendas(limit = 5) {
        const agendas = this.getAllAgendas();
        const now = new Date();
        
        return agendas
            .filter(agenda => new Date(agenda.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);
    }
}

// Initialize the agenda manager when the page loads
let agendaManager;

document.addEventListener('DOMContentLoaded', () => {
    agendaManager = new EnhancedAgendaManager();
});

// CSS Variables for consistent theming
document.documentElement.style.setProperty('--primary-color', '#133E87');
document.documentElement.style.setProperty('--secondary-color', '#608BC1');
document.documentElement.style.setProperty('--success-color', '#28a745');
document.documentElement.style.setProperty('--danger-color', '#dc3545');
document.documentElement.style.setProperty('--warning-color', '#ffc107');