/* ================================================
   CUNARD WORK ITEM DASHBOARD - JAVASCRIPT
   ================================================ */

// ================================================
// STATE MANAGEMENT
// ================================================

const DashboardState = {
    currentPassenger: 1,
    isDirty: false,
    expandedCards: new Set(),
    formData: {},
    pendingAction: null,
    lastSaveTime: null
};

// ================================================
// INITIALIZATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cunard Dashboard - Initializing...');
    initializeDashboard();
    attachEventListeners();
    loadDashboardData();
});

function initializeDashboard() {
    // Initialize form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            markDirty();
            autoSave();
        });
        input.addEventListener('input', markDirty);
    });
    
    console.log('Dashboard initialized successfully');
}

function attachEventListeners() {
    // Warn about unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (DashboardState.isDirty) {
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
// CARD OPERATIONS
// ================================================

function toggleCard(element) {
    const card = element.closest('.card');
    const content = card.querySelector('.card-content');
    
    if (DashboardState.expandedCards.has(card)) {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        DashboardState.expandedCards.delete(card);
        element.textContent = '⊕';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        DashboardState.expandedCards.add(card);
        element.textContent = '⊖';
    }
}

function openSettings() {
    showConfirmModal(
        'Settings',
        'Open work item settings?',
        () => {
            showNotification('Settings', 'Opening settings...', 'info');
        }
    );
}

function addDocument() {
    showConfirmModal(
        'Add Document',
        'Select a document to upload?',
        () => {
            showNotification('Add Document', 'Document upload dialog opened', 'info');
        }
    );
}

function addNote() {
    showConfirmModal(
        'Add Note',
        'Add a new note to this item?',
        () => {
            showNotification('Add Note', 'Note added successfully', 'success');
        }
    );
}

function moveUp() {
    showNotification('Move Up', 'Item moved up in the list', 'success');
}

function customizeLayout() {
    showConfirmModal(
        'Customize Layout',
        'Would you like to customize the dashboard layout?',
        () => {
            showNotification('Customize', 'Layout customization panel opened', 'info');
        }
    );
}

// ================================================
// PASSENGER OPERATIONS
// ================================================

function switchPassengerTab(passengerNumber, element) {
    // Remove active class from all tabs
    document.querySelectorAll('.passenger-tab-sm').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to current tab
    element.classList.add('active');
    
    // Hide all passenger details
    document.querySelectorAll('.passenger-details').forEach(detail => {
        detail.style.display = 'none';
    });
    
    // Show current passenger details
    const detailsElement = document.getElementById(`passengerDetails${passengerNumber}`);
    if (detailsElement) {
        detailsElement.style.display = 'block';
    }
    
    DashboardState.currentPassenger = passengerNumber;
    console.log('Switched to passenger:', passengerNumber);
}

// ================================================
// FORM DATA MANAGEMENT
// ================================================

function markDirty() {
    DashboardState.isDirty = true;
}

function markClean() {
    DashboardState.isDirty = false;
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
        currentPassenger: DashboardState.currentPassenger,
        expandedCards: Array.from(DashboardState.expandedCards),
        lastSaved: new Date().toISOString()
    };
    
    return formData;
}

function populateDashboardData(data) {
    if (!data) return;
    
    Object.keys(data).forEach(key => {
        if (key === '_meta') {
            DashboardState.currentPassenger = data._meta.currentPassenger;
        } else {
            const element = document.getElementById(key);
            if (element && data[key]) {
                element.value = data[key];
            }
        }
    });
}

function loadDashboardData() {
    const savedData = localStorage.getItem('cunardDashboardData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            populateDashboardData(data);
            markClean();
            console.log('Dashboard data loaded from localStorage');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
}

function autoSave() {
    const formData = collectFormData();
    localStorage.setItem('cunardDashboardData', JSON.stringify(formData));
    DashboardState.lastSaveTime = new Date();
    console.log('Dashboard auto-saved at', DashboardState.lastSaveTime.toLocaleTimeString());
}

// Auto-save every 30 seconds if dashboard is dirty
setInterval(() => {
    if (DashboardState.isDirty) {
        autoSave();
    }
}, 30000);

// ================================================
// FORM VALIDATION
// ================================================

function validateForm() {
    const requiredFields = ['cancelCode', 'reviwerNotes'];
    const errors = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            errors.push(`${fieldId} is required`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ================================================
// ACTION HANDLERS
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
            submitDashboardAction('pass_review', formData);
        }
    );
}

function handleCorrection() {
    showConfirmModal(
        'Correction Request',
        'Are you sure you want to request corrections?',
        () => {
            const formData = collectFormData();
            submitDashboardAction('correction_request', formData);
        }
    );
}

function handleCoaching() {
    showConfirmModal(
        'Coaching Request',
        'Are you sure you want to request coaching?',
        () => {
            submitDashboardAction('coaching_request', {});
        }
    );
}

function handleExit() {
    if (DashboardState.isDirty) {
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
    if (DashboardState.isDirty) {
        showConfirmModal(
            'Discard Changes',
            'You have unsaved changes. Do you want to discard them?',
            () => {
                markClean();
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
            submitDashboardAction('save', formData);
        }
    );
}

function handleSaveNext() {
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
            submitDashboardAction('save_next', formData);
        }
    );
}

// ================================================
// API SUBMISSION
// ================================================

function submitDashboardAction(action, formData) {
    showNotification('Processing', 'Submitting work item...', 'info');
    
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Dashboard action ${action} submitted:`, formData);
            
            // Save to localStorage
            localStorage.setItem('cunardDashboardData', JSON.stringify(formData));
            markClean();
            
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
    titleEl.style.cssText = 'font-weight: bold; margin-bottom: 4px; color: #d4af37;';
    titleEl.textContent = title;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'font-size: 13px; line-height: 1.4; color: #cccccc;';
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

// ================================================
// DEBUG TOOLS
// ================================================

const DebugDashboard = {
    logState() {
        console.log('Current Dashboard State:', DashboardState);
    },
    
    logFormData() {
        console.log('Current Form Data:', collectFormData());
    },
    
    clearStorage() {
        localStorage.removeItem('cunardDashboardData');
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
            populateDashboardData(data);
            console.log('Data imported successfully');
        } catch (error) {
            console.error('Error importing data:', error);
        }
    },
    
    fillTestData() {
        document.getElementById('cancelCode').value = 'CXL-2024-001';
        document.getElementById('reviwerNotes').value = 'Review completed. All documentation verified. Waiver amount is appropriate for the circumstances.';
        markDirty();
        console.log('Test data filled');
    }
};

window.DebugDashboard = DebugDashboard;

console.log('Cunard Dashboard - JavaScript loaded');
console.log('Debug commands available: DebugDashboard.logState(), DebugDashboard.exportData(), DebugDashboard.fillTestData()');
