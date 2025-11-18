/* ============================================
   CUNARD WORK ITEM FORM - JAVASCRIPT
   ============================================ */

// State Management
const formState = {
    currentTab: 0,
    pendingAction: null,
    formData: {},
    isDirty: false
};

// Initialize the form on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    attachEventListeners();
    loadFormData();
});

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

function initializeForm() {
    console.log('Initializing Cunard Work Item Form...');
    
    // Set up form state
    formState.currentTab = 0;
    formState.isDirty = false;
    
    // Initialize all form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (!input.hasAttribute('readonly')) {
            input.addEventListener('change', markFormDirty);
            input.addEventListener('input', markFormDirty);
        }
    });
    
    console.log('Form initialized successfully');
}

function attachEventListeners() {
    // Monitor form changes
    document.addEventListener('change', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            markFormDirty();
        }
    });
    
    // Handle window unload to warn about unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (formState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function loadFormData() {
    // Load saved form data from localStorage if available
    const savedData = localStorage.getItem('cunardFormData');
    if (savedData) {
        try {
            formState.formData = JSON.parse(savedData);
            populateFormFromData(formState.formData);
            console.log('Form data loaded from localStorage');
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabIndex) {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected tab
    if (tabButtons[tabIndex]) {
        tabButtons[tabIndex].classList.add('active');
        formState.currentTab = tabIndex;
        console.log('Switched to tab:', tabIndex);
    }
}

// ============================================
// MENU INTERACTIONS
// ============================================

function toggleMenu(element) {
    // Highlight the selected menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    console.log('Menu item selected:', element.textContent);
}

// ============================================
// FORM DATA MANAGEMENT
// ============================================

function markFormDirty() {
    formState.isDirty = true;
    console.log('Form marked as dirty');
}

function markFormClean() {
    formState.isDirty = false;
}

function collectFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
    
    return formData;
}

function populateFormFromData(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = data[key];
        }
    });
}

function validateForm() {
    const requiredFields = [
        'voyageNumber',
        'bookingNumber',
        'waiverDescription'
    ];
    
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            isValid = false;
            errors.push(`${field.previousElementSibling?.textContent || fieldId} is required`);
        }
    });
    
    return { isValid, errors };
}

// ============================================
// ACTION BUTTONS
// ============================================

function handlePassReview() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showNotification('Validation Error', validation.errors.join('\n'), 'error');
        return;
    }
    
    showConfirmModal(
        'Pass Review',
        'Are you sure you want to pass this work item for review?',
        () => {
            const formData = collectFormData();
            console.log('Pass Review - Form Data:', formData);
            showNotification('Success', 'Work item passed for review successfully', 'success');
            markFormClean();
        }
    );
}

function handleCorrectionRequest() {
    showConfirmModal(
        'Request Correction',
        'Are you sure you want to request corrections for this work item?',
        () => {
            const formData = collectFormData();
            console.log('Correction Request - Form Data:', formData);
            showNotification('Success', 'Correction request sent successfully', 'success');
        }
    );
}

function handleCoachingRequest() {
    showConfirmModal(
        'Coaching Request',
        'Are you sure you want to request coaching for this item?',
        () => {
            console.log('Coaching Request sent');
            showNotification('Success', 'Coaching request sent successfully', 'success');
        }
    );
}

function handleExitQueue() {
    if (formState.isDirty) {
        showConfirmModal(
            'Exit Work Queue',
            'You have unsaved changes. Are you sure you want to exit the work queue?',
            () => {
                console.log('Exiting work queue');
                showNotification('Info', 'Exiting work queue...', 'info');
                // Simulate exit
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }
        );
    } else {
        showConfirmModal(
            'Exit Work Queue',
            'Are you sure you want to exit the work queue?',
            () => {
                console.log('Exiting work queue');
                showNotification('Info', 'Exiting work queue...', 'info');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }
        );
    }
}

function handleCancel() {
    if (formState.isDirty) {
        showConfirmModal(
            'Cancel',
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
        showNotification('Validation Error', validation.errors.join('\n'), 'error');
        return;
    }
    
    showConfirmModal(
        'Save Changes',
        'Are you sure you want to save all changes?',
        () => {
            const formData = collectFormData();
            saveFormDataToServer(formData);
        }
    );
}

function handleNext() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showNotification('Validation Error', validation.errors.join('\n'), 'error');
        return;
    }
    
    showConfirmModal(
        'Next Step',
        'Save changes and proceed to the next step?',
        () => {
            const formData = collectFormData();
            saveFormDataToServer(formData);
            setTimeout(() => {
                // Simulate navigation to next page
                window.location.href = '/work-item/next';
            }, 1000);
        }
    );
}

// ============================================
// DATA PERSISTENCE
// ============================================

function saveFormDataToServer(formData) {
    console.log('Saving form data to server:', formData);
    
    // Save to localStorage as backup
    localStorage.setItem('cunardFormData', JSON.stringify(formData));
    
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Form data saved successfully');
            showNotification('Success', 'All changes saved successfully', 'success');
            markFormClean();
            resolve(true);
        }, 1000);
    });
}

function autoSaveFormData() {
    const formData = collectFormData();
    localStorage.setItem('cunardFormData', JSON.stringify(formData));
    console.log('Form auto-saved');
}

// Enable auto-save every 30 seconds if form has changes
setInterval(() => {
    if (formState.isDirty) {
        autoSaveFormData();
    }
}, 30000);

// ============================================
// MODAL FUNCTIONS
// ============================================

function showConfirmModal(title, message, onConfirm, onCancel) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = modal.querySelector('.modal-btn.confirm');
    const cancelBtn = modal.querySelector('.modal-btn.cancel');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Store the callback
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

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('confirmModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(title, message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-weight: bold; margin-bottom: 4px;';
    titleEl.textContent = title;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'font-size: 13px;';
    messageEl.textContent = message;
    
    notification.appendChild(titleEl);
    notification.appendChild(messageEl);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#2e8b57',
        error: '#d32f2f',
        warning: '#d97706',
        info: '#1e7ba9'
    };
    return colors[type] || colors.info;
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// FORM VALIDATION HELPERS
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function validateCurrency(value) {
    const currencyRegex = /^\$?\d+(\.\d{2})?$/;
    return currencyRegex.test(value);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
    if (typeof value === 'string') {
        value = parseFloat(value.replace('$', ''));
    }
    return '$' + value.toFixed(2);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US');
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

// ============================================
// LOGGING & DEBUG
// ============================================

const AppDebug = {
    logFormState: function() {
        console.log('Current Form State:', formState);
    },
    
    logFormData: function() {
        console.log('Current Form Data:', collectFormData());
    },
    
    clearLocalStorage: function() {
        localStorage.removeItem('cunardFormData');
        console.log('LocalStorage cleared');
    },
    
    exportFormData: function() {
        const data = collectFormData();
        const json = JSON.stringify(data, null, 2);
        console.log(json);
        return json;
    },
    
    importFormData: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            populateFormFromData(data);
            console.log('Form data imported successfully');
        } catch (error) {
            console.error('Error importing form data:', error);
        }
    }
};

// Expose debug functions to window for console access
window.AppDebug = AppDebug;

console.log('Cunard Work Item Form - JavaScript loaded successfully');
console.log('Debug commands available: AppDebug.logFormState(), AppDebug.exportFormData(), etc.');
