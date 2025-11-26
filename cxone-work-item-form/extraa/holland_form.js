/* ================================================
   HOLLAND AMERICA LINE WORK ITEM FORM - JAVASCRIPT
   ================================================ */

// ================================================
// STATE MANAGEMENT
// ================================================

const FormState = {
    currentTab: 'passenger-1',
    currentPassenger: 1,
    isDirty: false,
    expandedSections: {
        financial: true,
        voyage: false,
        waiver: false,
        fees: false
    },
    formData: {},
    pendingAction: null
};

// ================================================
// INITIALIZATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Holland America Line Work Item Form - Initializing...');
    initializeForm();
    attachEventListeners();
    loadSavedData();
});

function initializeForm() {
    // Expand financial section by default
    expandSection('financialSection');
    
    // Set initial tab as active
    document.querySelector('.tab-button').classList.add('active');
    
    // Initialize all form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            markFormDirty();
            autoSave();
        });
        input.addEventListener('input', markFormDirty);
    });
    
    console.log('Form initialized successfully');
}

function attachEventListeners() {
    // Listen for before unload to warn about unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (FormState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    // Close modal on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ================================================
// SECTION TOGGLE FUNCTIONALITY
// ================================================

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    
    const sectionName = sectionId.replace('Section', '').toLowerCase();
    
    // Toggle classes
    header.classList.toggle('collapsed');
    content.classList.toggle('collapsed');
    
    // Update state
    FormState.expandedSections[sectionName] = !content.classList.contains('collapsed');
    
    console.log(`Section ${sectionId} toggled:`, FormState.expandedSections[sectionName]);
}

function expandSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    
    header.classList.remove('collapsed');
    content.classList.remove('collapsed');
    
    const sectionName = sectionId.replace('Section', '').toLowerCase();
    FormState.expandedSections[sectionName] = true;
}

function collapseSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    
    header.classList.add('collapsed');
    content.classList.add('collapsed');
    
    const sectionName = sectionId.replace('Section', '').toLowerCase();
    FormState.expandedSections[sectionName] = false;
}

// ================================================
// TAB SWITCHING
// ================================================

function switchTab(tabId, buttonElement) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab
    buttonElement.classList.add('active');
    
    // Extract passenger number
    const passengerNum = buttonElement.getAttribute('data-passenger');
    if (passengerNum) {
        FormState.currentPassenger = parseInt(passengerNum);
    }
    
    FormState.currentTab = tabId;
    console.log('Switched to tab:', tabId, 'Passenger:', FormState.currentPassenger);
}

// ================================================
// FORM DATA MANAGEMENT
// ================================================

function markFormDirty() {
    FormState.isDirty = true;
    console.log('Form marked as dirty');
}

function markFormClean() {
    FormState.isDirty = false;
}

function collectFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = {
                value: input.value,
                type: input.type
            };
        }
    });
    
    formData.state = {
        currentTab: FormState.currentTab,
        currentPassenger: FormState.currentPassenger,
        expandedSections: FormState.expandedSections
    };
    
    return formData;
}

function populateFormFromData(data) {
    if (!data) return;
    
    Object.keys(data).forEach(key => {
        if (key === 'state') {
            // Restore state
            FormState.currentTab = data.state.currentTab;
            FormState.currentPassenger = data.state.currentPassenger;
            FormState.expandedSections = data.state.expandedSections;
        } else {
            const element = document.getElementById(key);
            if (element && data[key].value) {
                element.value = data[key].value;
            }
        }
    });
    
    console.log('Form data restored');
}

function loadSavedData() {
    const savedData = localStorage.getItem('hollandFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            populateFormFromData(data);
            markFormClean();
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

function autoSave() {
    if (FormState.isDirty) {
        const formData = collectFormData();
        localStorage.setItem('hollandFormData', JSON.stringify(formData));
        console.log('Form auto-saved');
    }
}

// Auto-save every 30 seconds if form is dirty
setInterval(autoSave, 30000);

// ================================================
// FORM VALIDATION
// ================================================

function validateForm() {
    const requiredFields = ['voyageNumber', 'bookingNumber', 'waiverDescription'];
    const errors = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            const label = field.previousElementSibling?.textContent || fieldId;
            errors.push(`${label} is required`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\d{10,}$/.test(phone.replace(/\D/g, ''));
}

function validateCurrency(value) {
    return /^\$?\d+(\.\d{2})?$/.test(value);
}

// ================================================
// WAIVER CODE HANDLER
// ================================================

function updateWaiverDescription() {
    const waiverCode = document.getElementById('waiverCode').value;
    const descriptions = {
        'COVID-19': 'Global pandemic related cancellation',
        'MEDICAL': 'Medical emergency preventing travel',
        'PERSONAL': 'Personal emergency preventing travel',
        'OTHER': 'Other reason for cancellation'
    };
    
    const description = descriptions[waiverCode] || '';
    const descField = document.getElementById('waiverDescription');
    if (description && !descField.value) {
        descField.value = description;
        markFormDirty();
    }
}

// ================================================
// ACTION BUTTONS
// ================================================

function handlePassReview() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showNotification('Validation Error', validation.errors.join(', '), 'error');
        return;
    }
    
    showConfirmModal(
        'Pass Review',
        'Are you sure you want to pass this work item for review?',
        () => {
            const formData = collectFormData();
            console.log('Pass Review - Form Data:', formData);
            submitWorkItem('pass_review', formData);
        }
    );
}

function handleCorrectionRequest() {
    showConfirmModal(
        'Correction Request',
        'Are you sure you want to request corrections?',
        () => {
            const formData = collectFormData();
            console.log('Correction Request - Form Data:', formData);
            submitWorkItem('correction_request', formData);
        }
    );
}

function handleCoachingRequest() {
    showConfirmModal(
        'Coaching Request',
        'Are you sure you want to request coaching?',
        () => {
            console.log('Coaching Request');
            submitWorkItem('coaching_request', {});
        }
    );
}

function handleExitQueue() {
    if (FormState.isDirty) {
        showConfirmModal(
            'Exit Work Queue',
            'You have unsaved changes. Are you sure you want to exit?',
            () => {
                window.location.href = '/dashboard';
            }
        );
    } else {
        showConfirmModal(
            'Exit Work Queue',
            'Are you sure you want to exit the work queue?',
            () => {
                window.location.href = '/dashboard';
            }
        );
    }
}

function handleCancel() {
    if (FormState.isDirty) {
        showConfirmModal(
            'Discard Changes',
            'You have unsaved changes. Do you want to discard them?',
            () => {
                markFormClean();
                window.history.back();
            }
        );
    } else {
        window.history.back();
    }
}

function handleSave() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showNotification('Validation Error', validation.errors.join(', '), 'error');
        return;
    }
    
    showConfirmModal(
        'Save Changes',
        'Save all changes?',
        () => {
            const formData = collectFormData();
            submitWorkItem('save', formData);
        }
    );
}

function handleSaveNext() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showNotification('Validation Error', validation.errors.join(', '), 'error');
        return;
    }
    
    showConfirmModal(
        'Save & Next',
        'Save changes and proceed to next item?',
        () => {
            const formData = collectFormData();
            submitWorkItem('save_next', formData);
        }
    );
}

// ================================================
// API SUBMISSION
// ================================================

function submitWorkItem(action, formData) {
    showNotification('Processing', 'Submitting work item...', 'info');
    
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Work item ${action} submitted:`, formData);
            
            // Save to localStorage
            localStorage.setItem('hollandFormData', JSON.stringify(formData));
            markFormClean();
            
            const messages = {
                'save': 'Changes saved successfully',
                'pass_review': 'Work item passed for review',
                'correction_request': 'Correction request sent',
                'coaching_request': 'Coaching request sent',
                'save_next': 'Changes saved, loading next item...'
            };
            
            showNotification('Success', messages[action] || 'Operation completed', 'success');
            
            if (action === 'save_next') {
                setTimeout(() => {
                    window.location.href = '/work-item/next';
                }, 1500);
            }
            
            resolve(true);
        }, 1000);
    });
}

// ================================================
// MODAL FUNCTIONS
// ================================================

function showConfirmModal(title, message, onConfirm, onCancel) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const confirmBtn = modal.querySelector('.modal-btn.confirm');
    const cancelBtn = modal.querySelector('.modal-btn.cancel');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Store callbacks
    window.confirmCallback = onConfirm;
    window.cancelCallback = onCancel;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    window.confirmCallback = null;
    window.cancelCallback = null;
}

function confirmAction() {
    if (window.confirmCallback) {
        window.confirmCallback();
    }
    closeModal();
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('confirmModal');
    if (e.target === modal.querySelector('.modal-overlay')) {
        closeModal();
    }
});

// ================================================
// NOTIFICATION SYSTEM
// ================================================

function showNotification(title, message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Clear existing content
    notification.innerHTML = '';
    
    // Create title
    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-weight: bold; margin-bottom: 4px;';
    titleEl.textContent = title;
    
    // Create message
    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'font-size: 13px;';
    messageEl.textContent = message;
    
    notification.appendChild(titleEl);
    notification.appendChild(messageEl);
    
    // Add class for styling
    notification.className = `notification show ${type}`;
    
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.classList.remove('show');
            notification.style.animation = '';
        }, 300);
    }, 5000);
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

function formatCurrency(value) {
    if (typeof value === 'string') {
        value = parseFloat(value.replace('$', ''));
    }
    if (isNaN(value)) return '$0.00';
    return '$' + value.toFixed(2);
}

function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================================
// DEBUG & HELPER FUNCTIONS
// ================================================

const DebugTools = {
    logFormState() {
        console.log('Form State:', FormState);
    },
    
    logFormData() {
        console.log('Form Data:', collectFormData());
    },
    
    clearStorage() {
        localStorage.removeItem('hollandFormData');
        console.log('LocalStorage cleared');
    },
    
    exportData() {
        const data = collectFormData();
        console.log(JSON.stringify(data, null, 2));
        return data;
    },
    
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            populateFormFromData(data);
            console.log('Data imported successfully');
        } catch (error) {
            console.error('Error importing data:', error);
        }
    },
    
    fillTestData() {
        document.getElementById('voyageNumber').value = 'VOY123456';
        document.getElementById('bookingNumber').value = 'BK987654';
        document.getElementById('departureDate').value = '2024-01-15';
        document.getElementById('returnDate').value = '2024-01-22';
        document.getElementById('destination').value = 'Caribbean';
        document.getElementById('ship').value = 'Nieuw Amsterdam';
        document.getElementById('waiverCode').value = 'COVID-19';
        updateWaiverDescription();
        document.getElementById('waiverDescription').value = 'Guest unable to travel due to COVID-19 related circumstances';
        document.getElementById('cancelCode').value = 'CAL-001';
        document.getElementById('waiverAmount').value = '1500';
        document.getElementById('airFee').value = '500';
        document.getElementById('packageFee').value = '2000';
        document.getElementById('nonRefundable').value = '200';
        document.getElementById('insuranceFee').value = '150';
        markFormDirty();
        console.log('Test data filled');
    }
};

// Expose debug tools
window.Debug = DebugTools;

console.log('Holland America Line Work Item Form - JavaScript loaded');
console.log('Debug commands: Debug.logFormState(), Debug.exportData(), Debug.fillTestData()');
