/* ================================================
   PRINCESS CRUISES WORK ITEM FORM - JavaScript
   ================================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

const FormState = {
    isDirty: false,
    currentPassenger: 1,
    expandedSections: {
        voyageBooking: true,
        financialSummary: true,
        waiverReason: true,
        cancelCode: true
    },
    formData: {
        passenger1: {
            voyageBooking: {
                itinerary: '',
                bookingReference: '',
                cabin: '',
                embarkPort: '',
                disembarkPort: '',
                sailDate: ''
            },
            financialSummary: {
                airFee: '$0.00',
                packageFee: '$0.00',
                transferFee: '$0.00',
                totalFee: '$0.00'
            },
            waiverReason: {
                reason: '',
                amount: ''
            },
            cancelCode: {
                code: '',
                description: ''
            }
        },
        passenger2: {
            voyageBooking: {
                itinerary: '',
                bookingReference: '',
                cabin: '',
                embarkPort: '',
                disembarkPort: '',
                sailDate: ''
            },
            financialSummary: {
                airFee: '$0.00',
                packageFee: '$0.00',
                transferFee: '$0.00',
                totalFee: '$0.00'
            },
            waiverReason: {
                reason: '',
                amount: ''
            },
            cancelCode: {
                code: '',
                description: ''
            }
        }
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    loadFormData();
    startAutoSave();
    attachWindowListeners();
});

function initializeForm() {
    attachEventListeners();
    setupPassengerTabs();
    setupSectionToggles();
    setupActionButtons();
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    // Voyage & Booking inputs
    document.querySelectorAll('.voyage-booking-group input').forEach(input => {
        input.addEventListener('change', markFormDirty);
        input.addEventListener('blur', markFormDirty);
    });

    // Waiver Reason inputs
    document.querySelectorAll('.waiver-reason-group input').forEach(input => {
        input.addEventListener('change', markFormDirty);
        input.addEventListener('blur', markFormDirty);
    });

    // Cancel Code inputs
    document.querySelectorAll('.cancel-code-group input').forEach(input => {
        input.addEventListener('change', markFormDirty);
        input.addEventListener('blur', markFormDirty);
    });

    // Financial inputs
    document.querySelectorAll('.financial-input').forEach(input => {
        input.addEventListener('change', markFormDirty);
    });
}

function setupPassengerTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const passengerNum = parseInt(e.target.dataset.passenger);
            switchPassenger(passengerNum);
        });
    });
}

function setupSectionToggles() {
    const voyageToggle = document.querySelector('[data-toggle="voyageBooking"]');
    const financialToggle = document.querySelector('[data-toggle="financialSummary"]');
    const waiverToggle = document.querySelector('[data-toggle="waiverReason"]');
    const cancelToggle = document.querySelector('[data-toggle="cancelCode"]');

    if (voyageToggle) voyageToggle.addEventListener('click', () => toggleSection('voyageBooking'));
    if (financialToggle) financialToggle.addEventListener('click', () => toggleSection('financialSummary'));
    if (waiverToggle) waiverToggle.addEventListener('click', () => toggleSection('waiverReason'));
    if (cancelToggle) cancelToggle.addEventListener('click', () => toggleSection('cancelCode'));
}

function setupActionButtons() {
    const passReviewBtn = document.getElementById('passReviewBtn');
    const correctionBtn = document.getElementById('correctionBtn');
    const eareviewBtn = document.getElementById('eareviewBtn');
    const coachingBtn = document.getElementById('coachingBtn');
    const exitQueueBtn = document.getElementById('exitQueueBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveNextBtn = document.getElementById('saveNextBtn');

    if (passReviewBtn) passReviewBtn.addEventListener('click', handlePassReview);
    if (correctionBtn) correctionBtn.addEventListener('click', handleCorrection);
    if (eareviewBtn) eareviewBtn.addEventListener('click', handleEAReview);
    if (coachingBtn) coachingBtn.addEventListener('click', handleCoaching);
    if (exitQueueBtn) exitQueueBtn.addEventListener('click', handleExit);
    if (saveBtn) saveBtn.addEventListener('click', handleSave);
    if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
    if (saveNextBtn) saveNextBtn.addEventListener('click', handleSaveNext);
}

// ============================================
// PASSENGER MANAGEMENT
// ============================================

function switchPassenger(passengerNum) {
    if (FormState.currentPassenger === passengerNum) return;

    // Save current passenger data
    collectFormData();

    // Switch passenger
    FormState.currentPassenger = passengerNum;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.passenger) === passengerNum) {
            btn.classList.add('active');
        }
    });

    // Load new passenger data
    populateFormData();
}

// ============================================
// FORM DATA MANAGEMENT
// ============================================

function collectFormData() {
    const passengerKey = `passenger${FormState.currentPassenger}`;
    const passenger = FormState.formData[passengerKey];

    // Voyage & Booking
    passenger.voyageBooking.itinerary = document.getElementById('itinerary')?.value || '';
    passenger.voyageBooking.bookingReference = document.getElementById('bookingRef')?.value || '';
    passenger.voyageBooking.cabin = document.getElementById('cabin')?.value || '';
    passenger.voyageBooking.embarkPort = document.getElementById('embarkPort')?.value || '';
    passenger.voyageBooking.disembarkPort = document.getElementById('disembarkPort')?.value || '';
    passenger.voyageBooking.sailDate = document.getElementById('sailDate')?.value || '';

    // Waiver Reason
    passenger.waiverReason.reason = document.getElementById('waiverReason')?.value || '';
    passenger.waiverReason.amount = document.getElementById('waiverAmount')?.value || '';

    // Cancel Code
    passenger.cancelCode.code = document.getElementById('cancelCode')?.value || '';
    passenger.cancelCode.description = document.getElementById('cancelDesc')?.value || '';
}

function populateFormData() {
    const passengerKey = `passenger${FormState.currentPassenger}`;
    const passenger = FormState.formData[passengerKey];

    // Voyage & Booking
    const itineraryEl = document.getElementById('itinerary');
    const bookingRefEl = document.getElementById('bookingRef');
    const cabinEl = document.getElementById('cabin');
    const embarkPortEl = document.getElementById('embarkPort');
    const disembarkPortEl = document.getElementById('disembarkPort');
    const sailDateEl = document.getElementById('sailDate');

    if (itineraryEl) itineraryEl.value = passenger.voyageBooking.itinerary || '';
    if (bookingRefEl) bookingRefEl.value = passenger.voyageBooking.bookingReference || '';
    if (cabinEl) cabinEl.value = passenger.voyageBooking.cabin || '';
    if (embarkPortEl) embarkPortEl.value = passenger.voyageBooking.embarkPort || '';
    if (disembarkPortEl) disembarkPortEl.value = passenger.voyageBooking.disembarkPort || '';
    if (sailDateEl) sailDateEl.value = passenger.voyageBooking.sailDate || '';

    // Waiver Reason
    const waiverReasonEl = document.getElementById('waiverReason');
    const waiverAmountEl = document.getElementById('waiverAmount');

    if (waiverReasonEl) waiverReasonEl.value = passenger.waiverReason.reason || '';
    if (waiverAmountEl) waiverAmountEl.value = passenger.waiverReason.amount || '';

    // Cancel Code
    const cancelCodeEl = document.getElementById('cancelCode');
    const cancelDescEl = document.getElementById('cancelDesc');

    if (cancelCodeEl) cancelCodeEl.value = passenger.cancelCode.code || '';
    if (cancelDescEl) cancelDescEl.value = passenger.cancelCode.description || '';

    FormState.isDirty = false;
}

function loadFormData() {
    const savedData = localStorage.getItem('princess-form-data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            FormState.formData = parsed;
            populateFormData();
        } catch (e) {
            console.error('Error loading form data:', e);
        }
    }
}

function saveFormData() {
    collectFormData();
    localStorage.setItem('princess-form-data', JSON.stringify(FormState.formData));
}

// ============================================
// FORM VALIDATION
// ============================================

function validateForm() {
    const requiredFields = [
        { id: 'itinerary', name: 'Itinerary' },
        { id: 'bookingRef', name: 'Booking Reference' },
        { id: 'cabin', name: 'Cabin' },
        { id: 'embarkPort', name: 'Embark Port' },
        { id: 'disembarkPort', name: 'Disembark Port' },
        { id: 'sailDate', name: 'Sail Date' }
    ];

    const missingFields = [];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            missingFields.push(field.name);
        }
    });

    if (missingFields.length > 0) {
        showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
        return false;
    }

    return true;
}

// ============================================
// SECTION TOGGLING
// ============================================

function toggleSection(sectionName) {
    FormState.expandedSections[sectionName] = !FormState.expandedSections[sectionName];
    const toggle = document.querySelector(`[data-toggle="${sectionName}"]`);
    if (toggle) {
        toggle.classList.toggle('expanded');
    }
}

// ============================================
// AUTO-SAVE
// ============================================

let autoSaveInterval = null;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (FormState.isDirty) {
            saveFormData();
            showNotification('Form saved automatically', 'info');
            FormState.isDirty = false;
        }
    }, 30000);
}

function markFormDirty() {
    FormState.isDirty = true;
}

// ============================================
// ACTION HANDLERS
// ============================================

function handlePassReview() {
    if (!validateForm()) return;

    showConfirmModal(
        'Pass Review',
        'Are you sure you want to pass this work item for review?',
        () => {
            saveFormData();
            showNotification('Work item passed for review successfully!', 'success');
            setTimeout(() => {
                localStorage.removeItem('princess-form-data');
                location.reload();
            }, 2000);
        }
    );
}

function handleCorrection() {
    showConfirmModal(
        'Request Correction',
        'Send this work item for correction?',
        () => {
            saveFormData();
            showNotification('Correction request sent!', 'success');
        }
    );
}

function handleEAReview() {
    showNotification('EAREVIEW chat opened in separate window', 'info');
    // In a real application, this would open a chat interface
}

function handleCoaching() {
    showConfirmModal(
        'Coaching Request',
        'Send coaching request for this work item?',
        () => {
            saveFormData();
            showNotification('Coaching request submitted!', 'success');
        }
    );
}

function handleExit() {
    showConfirmModal(
        'Exit Queue',
        'Are you sure you want to exit the queue? Unsaved changes will be lost.',
        () => {
            localStorage.removeItem('princess-form-data');
            showNotification('Exiting queue...', 'info');
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    );
}

function handleSave() {
    if (!validateForm()) return;
    saveFormData();
    showNotification('Work item saved successfully!', 'success');
    FormState.isDirty = false;
}

function handleCancel() {
    if (FormState.isDirty) {
        showConfirmModal(
            'Discard Changes',
            'You have unsaved changes. Are you sure you want to discard them?',
            () => {
                localStorage.removeItem('princess-form-data');
                location.reload();
            }
        );
    } else {
        location.reload();
    }
}

function handleSaveNext() {
    if (!validateForm()) return;
    saveFormData();
    showNotification('Work item saved! Loading next item...', 'success');
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.classList.add('active');

    // Remove old listeners and add new ones
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        closeModal();
    });

    newCancelBtn.addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ============================================
// WINDOW LISTENERS
// ============================================

function attachWindowListeners() {
    window.addEventListener('beforeunload', (e) => {
        if (FormState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// ============================================
// DEBUG TOOLS (Exposed to window)
// ============================================

const Debug = {
    logState: () => {
        console.log('Current Form State:', FormState);
    },
    fillTestData: () => {
        FormState.formData.passenger1.voyageBooking = {
            itinerary: 'Caribbean - 7 Days',
            bookingReference: 'PRI-2024-001',
            cabin: '1234',
            embarkPort: 'Miami, FL',
            disembarkPort: 'Miami, FL',
            sailDate: '2024-12-20'
        };
        FormState.formData.passenger1.waiverReason = {
            reason: 'Medical Emergency',
            amount: '$2,500.00'
        };
        FormState.formData.passenger1.cancelCode = {
            code: 'MED-CANCEL',
            description: 'Medical emergency cancellation'
        };
        populateFormData();
        saveFormData();
        console.log('Test data filled');
    },
    clearData: () => {
        localStorage.removeItem('princess-form-data');
        location.reload();
    },
    exportData: () => {
        collectFormData();
        const dataStr = JSON.stringify(FormState.formData, null, 2);
        console.log(dataStr);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'princess-form-data.json';
        a.click();
    },
    importData: (jsonStr) => {
        try {
            const data = JSON.parse(jsonStr);
            FormState.formData = data;
            saveFormData();
            location.reload();
            console.log('Data imported successfully');
        } catch (e) {
            console.error('Error importing data:', e);
        }
    }
};

// Expose Debug to window
window.Debug = Debug;
