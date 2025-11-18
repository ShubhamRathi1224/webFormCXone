/* ================================================
   SEABOURN WORK ITEM FORM - JAVASCRIPT
   ================================================ */

// ================================================
// STATE MANAGEMENT
// ================================================

const AppState = {
    currentPassenger: 1,
    isDirty: false,
    expandedSections: {
        financial: true,
        voyage: false,
        waived: false,
        waiverReason: false,
        airPackage: false,
        additionalWaiver: false
    },
    formData: {},
    pendingAction: null,
    lastSaveTime: null
};

// ================================================
// INITIALIZATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Seabourn Work Item Form - Initializing...');
    initializeForm();
    attachEventListeners();
    loadFormData();
});

function initializeForm() {
    // Set financial section as expanded by default
    document.getElementById('financialSection')?.classList.add('expanded');
    
    // Initialize all form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            markFormDirty();
            autoSave();
        });
        input.addEventListener('input', () => {
            markFormDirty();
        });
    });
    
    console.log('Form initialized successfully');
}

function attachEventListeners() {
    // Warn about unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (AppState.isDirty) {
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
    if (!section) return;
    
    const isExpanded = section.classList.contains('expanded');
    
    if (isExpanded) {
        section.classList.remove('expanded');
    } else {
        section.classList.add('expanded');
    }
    
    const sectionKey = sectionId.replace('Section', '').toLowerCase();
    AppState.expandedSections[sectionKey] = !isExpanded;
    
    console.log(`Section ${sectionId} toggled:`, AppState.expandedSections[sectionKey]);
}

// ================================================
// TAB SWITCHING
// ================================================

function switchPassenger(passengerNumber, element) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked element
    element.classList.add('active');
    
    AppState.currentPassenger = passengerNumber;
    console.log('Switched to passenger:', passengerNumber);
    
    // Could load different data per passenger here
    loadPassengerData(passengerNumber);
}

function loadPassengerData(passengerNumber) {
    // Simulate loading passenger-specific data
    console.log(`Loading data for passenger ${passengerNumber}`);
}

// ================================================
// FORM DATA MANAGEMENT
// ================================================

function markFormDirty() {
    AppState.isDirty = true;
}

function markFormClean() {
    AppState.isDirty = false;
}

function collectFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
    
    formData._meta = {
        currentPassenger: AppState.currentPassenger,
        expandedSections: AppState.expandedSections,
        lastSaved: new Date().toISOString()
    };
    
    return formData;
}

function populateFormData(data) {
    if (!data) return;
    
    Object.keys(data).forEach(key => {
        if (key === '_meta') {
            // Restore state
            AppState.currentPassenger = data._meta.currentPassenger;
            AppState.expandedSections = data._meta.expandedSections;
        } else {
            const element = document.getElementById(key);
            if (element && data[key]) {
                element.value = data[key];
            }
        }
    });
}

function loadFormData() {
    const savedData = localStorage.getItem('seabournFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            populateFormData(data);
            markFormClean();
            console.log('Form data loaded from localStorage');
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }
}

function autoSave() {
    const formData = collectFormData();
    localStorage.setItem('seabournFormData', JSON.stringify(formData));
    AppState.lastSaveTime = new Date();
    console.log('Form auto-saved at', AppState.lastSaveTime.toLocaleTimeString());
}

// Auto-save every 30 seconds if form is dirty
setInterval(() => {
    if (AppState.isDirty) {
        autoSave();
    }
}, 30000);

// ================================================
// FORM VALIDATION
// ================================================

function validateForm() {
    const requiredFields = [
        'voyageNumber',
        'bookingNumber',
        'waiverReasonCode',
        'waiverReasonDescription'
    ];
    
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

// ================================================
// WAIVER REASON HANDLER
// ================================================

function handleWaiverReasonChange() {
    const reasonCode = document.getElementById('waiverReasonCode').value;
    const descriptions = {
        'COVID-19': 'Guest unable to travel due to COVID-19 related circumstances affecting their health or travel restrictions.',
        'MEDICAL': 'Guest has a medical condition that prevents them from traveling.',
        'PERSONAL': 'Guest has a personal emergency that requires them to cancel the voyage.',
        'WORK': 'Guest has a work-related emergency that prevents travel.',
        'OTHER': 'Other reason not listed above.'
    };
    
    const descField = document.getElementById('waiverReasonDescription');
    if (descriptions[reasonCode] && !descField.value) {
        descField.value = descriptions[reasonCode];
        markFormDirty();
    }
}

// ================================================
// ACTION BUTTONS
// ================================================

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
            submitWorkItem('pass_review', formData);
        }
    );
}

function handleCorrectionRequest() {
    showConfirmModal(
        'Request Correction',
        'Are you sure you want to request corrections for this work item?',
        () => {
            const formData = collectFormData();
            submitWorkItem('correction_request', formData);
        }
    );
}

function handleCoachingRequest() {
    showConfirmModal(
        'Request Coaching',
        'Are you sure you want to request coaching for this item?',
        () => {
            submitWorkItem('coaching_request', {});
        }
    );
}

function handleExitQueue() {
    if (AppState.isDirty) {
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
    if (AppState.isDirty) {
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
        showNotification('Validation Error', validation.errors.join('\n'), 'error');
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

function handleNext() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showNotification('Validation Error', validation.errors.join('\n'), 'error');
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
            localStorage.setItem('seabournFormData', JSON.stringify(formData));
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
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
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
    if (modal && e.target === modal.querySelector('.modal-overlay')) {
        closeModal();
    }
});

// ================================================
// NOTIFICATION SYSTEM
// ================================================

function showNotification(title, message, type = 'info') {
    const notification = document.getElementById('notification');
    
    notification.innerHTML = '';
    
    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-weight: bold; margin-bottom: 4px;';
    titleEl.textContent = title;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'font-size: 13px; line-height: 1.4;';
    messageEl.textContent = message;
    
    notification.appendChild(titleEl);
    notification.appendChild(messageEl);
    
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
// DEBUG TOOLS
// ================================================

const DebugTools = {
    logState() {
        console.log('Current App State:', AppState);
    },
    
    logFormData() {
        console.log('Current Form Data:', collectFormData());
    },
    
    clearStorage() {
        localStorage.removeItem('seabournFormData');
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
            populateFormData(data);
            console.log('Data imported successfully');
        } catch (error) {
            console.error('Error importing data:', error);
        }
    },
    
    fillTestData() {
        document.getElementById('voyageNumber').value = 'SEA-2024-001';
        document.getElementById('bookingNumber').value = 'BK123456789';
        document.getElementById('departureDate').value = '2024-02-15';
        document.getElementById('returnDate').value = '2024-02-22';
        document.getElementById('destination').value = 'Caribbean Cruise';
        document.getElementById('shipName').value = 'Seabourn Venture';
        document.getElementById('totalWaived').value = '$1000.00';
        document.getElementById('waiverNotes').value = 'Guest requested waiver due to family emergency';
        document.getElementById('waiverReasonCode').value = 'PERSONAL';
        handleWaiverReasonChange();
        document.getElementById('cancelCode').value = 'CXL-001';
        document.getElementById('refundAmount').value = '$500.00';
        document.getElementById('airFee').value = '$400.00';
        document.getElementById('packageFee').value = '$1200.00';
        document.getElementById('nonRefundableFee').value = '$100.00';
        document.getElementById('insuranceFee').value = '$150.00';
        markFormDirty();
        console.log('Test data filled');
    }
};

window.Debug = DebugTools;

console.log('Seabourn Work Item Form - JavaScript loaded');
console.log('Debug commands available: Debug.logState(), Debug.exportData(), Debug.fillTestData()');
