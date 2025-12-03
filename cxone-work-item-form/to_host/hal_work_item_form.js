/* ================================================
   HOLLAND AMERICA LINE WORK ITEM FORM - JavaScript
   ================================================ */

import { BRANDS } from "../data.js";

// ============================================
// STATE MANAGEMENT
// ============================================

const FormState = {
    isDirty: false,
    currentPassenger: 1,
    expandedSections: {
        voyageDetails: true,
        cancellationFees: true,
        waiverCancellation: true,
        otherPassengers: true
    },
    formData: {
        passenger1: {
            voyageDetails: {
                voyageNumber: '',
                bookingNumber: '',
                currency: 'USD'
            },
            waiverCancellation: {
                waiverReasonCode: '',
                waiverReasonDesc: '',
                cancelCode: '',
                refNotes: ''
            }
        },
        passenger2: {
            voyageDetails: {
                voyageNumber: '',
                bookingNumber: '',
                currency: 'USD'
            },
            waiverCancellation: {
                waiverReasonCode: '',
                waiverReasonDesc: '',
                cancelCode: '',
                refNotes: ''
            }
        },
        passenger3: {
            voyageDetails: {
                voyageNumber: '',
                bookingNumber: '',
                currency: 'USD'
            },
            waiverCancellation: {
                waiverReasonCode: '',
                waiverReasonDesc: '',
                cancelCode: '',
                refNotes: ''
            }
        }
    }
};

// Sample passenger data - This would come from your database
const passengerData = [
    {
        name: 'John Doe',
        totalCancelFees: '398.04',
        totalWaived: '398.04',
        netCancelledFee: '0.00',
        waiveReasonCD: 'PL',
        waiveReasonDescription: 'POLAR ERROR',
        cancelCode: 'D',
        airCancelFees: '398.04',
        packageCancelFees: '0.00',
        transferCancelFees: '0.00',
        ncfChargesCancelFees: '0.00',
        nonRefundablePremium: '0.00',
        openDate: '04/22/2025'
    },
    {
        name: 'Jane Smith',
        totalCancelFees: '275.50',
        totalWaived: '275.50',
        netCancelledFee: '0.00',
        waiveReasonCD: 'PL',
        waiveReasonDescription: 'POLAR ERROR',
        cancelCode: 'D',
        airCancelFees: '275.50',
        packageCancelFees: '0.00',
        transferCancelFees: '0.00',
        ncfChargesCancelFees: '0.00',
        nonRefundablePremium: '0.00',
        openDate: '04/22/2025'
    },
    {
        name: 'Bob Johnson',
        totalCancelFees: '150.00',
        totalWaived: '150.00',
        netCancelledFee: '0.00',
        waiveReasonCD: 'PL',
        waiveReasonDescription: 'POLAR ERROR',
        cancelCode: 'D',
        airCancelFees: '150.00',
        packageCancelFees: '0.00',
        transferCancelFees: '0.00',
        ncfChargesCancelFees: '0.00',
        nonRefundablePremium: '0.00',
        openDate: '04/22/2025'
    },
    {
        name: 'Alice Williams',
        totalCancelFees: '0.00',
        totalWaived: '0.00',
        netCancelledFee: '0.00',
        waiveReasonCD: '',
        waiveReasonDescription: '',
        cancelCode: '',
        airCancelFees: '0.00',
        packageCancelFees: '0.00',
        transferCancelFees: '0.00',
        ncfChargesCancelFees: '0.00',
        nonRefundablePremium: '0.00',
        openDate: '04/22/2025'
    }
];

// Field configuration
const fieldConfig = [
    { key: 'totalCancelFees', label: 'Total Cancel Fees', type: 'text' },
    { key: 'totalWaived', label: 'Total Waived', type: 'text' },
    { key: 'netCancelledFee', label: 'Net Cancelled Fee', type: 'text' },
    { key: 'waiveReasonCD', label: 'Waive Reason CD', type: 'text' },
    { key: 'waiveReasonDescription', label: 'Waive Reason Description', type: 'textarea' },
    { key: 'cancelCode', label: 'Cancel Code', type: 'text' },
    { key: 'airCancelFees', label: 'Air Cancel Fees', type: 'text' },
    { key: 'packageCancelFees', label: 'Package Cancel Fees', type: 'text' },
    { key: 'transferCancelFees', label: 'Transfer Cancel Fees', type: 'text' },
    { key: 'ncfChargesCancelFees', label: 'NCF Charges Cancel Fees', type: 'text' },
    { key: 'nonRefundablePremium', label: 'Non-Refundable Premium/Waiver', type: 'text' },
    { key: 'openDate', label: 'Open Date', type: 'text' }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setTheme();
    initializeTable();
    serviceSelector.addEventListener("change", (e) => {
        setTheme(e.target.value);
    });
    initializeForm();
    loadFormData();
    startAutoSave();
    attachWindowListeners();

    
    document.getElementById("otherCorrection").addEventListener("change", (e)=>toggleField(e,"otherCorrectionField"));
    document.getElementById("otherCoaching").addEventListener("change", (e)=>toggleField(e,"otherCoachingDetailsField"));
});

function toggleField(e, fieldId){
  const selected = e.target.checked; 
  const targetEl = document.getElementById(fieldId);

  if (selected) {
    targetEl.style.display = "block"; 
} else {
    targetEl.style.display = "none";
  }
}

function setTheme(name = "holland") {
  document.documentElement.setAttribute("data-theme", name);
  serviceSelector.value = name;

  const brand = BRANDS[name] || Object.values(BRANDS)[0];
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = brand.favicon;
}

function initializeTable() {
    const totalPassengers = passengerData.length;
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Field Name</th>';
    
    for (let i = 0; i < totalPassengers; i++) {
        headerRow.innerHTML += `<th>${passengerData[i].name}</th>`;
    }
    document.getElementById('tableHeader').appendChild(headerRow);
    const tbody = document.getElementById('tableBody');
    fieldConfig.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${field.label}</td>`;
        for (let i = 0; i < totalPassengers; i++) {
            const td = document.createElement('td');
            const value = i < passengerData.length ? (passengerData[i][field.key] || '') : '';
            if (field.type === 'textarea') {
                td.innerHTML = `<textarea readonly>${value}</textarea>`;
            } else {
                td.innerHTML = `<input type="text" value="${value}" readonly>`;
            }
            row.appendChild(td);
        }
        tbody.appendChild(row);
    });
}

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
    // Voyage Details inputs
    document.querySelectorAll('.voyage-detail-input').forEach(input => {
        input.addEventListener('change', markFormDirty);
        input.addEventListener('blur', markFormDirty);
    });

    // Waiver inputs
    document.querySelectorAll('.waiver-input').forEach(input => {
        input.addEventListener('change', markFormDirty);
        input.addEventListener('blur', markFormDirty);
    });
}

function setupPassengerTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const passengerNum = parseInt(e.currentTarget.dataset.passenger);
            switchPassenger(passengerNum);
        });
    });
}

function setupSectionToggles() {
    const sections = document.querySelectorAll('.section-title');
    sections.forEach(section => {
        section.addEventListener('click', () => {
            const nextContent = section.nextElementSibling;
            if (nextContent && nextContent.classList.contains('section-content')) {
                nextContent.style.display = nextContent.style.display === 'none' ? 'block' : 'none';
                section.classList.toggle('collapsed');
            }
        });
    });
}

function setupActionButtons() {
    const passReviewBtn = document.getElementById('passReviewBtn');
    const correctionBtn = document.getElementById('correctionBtn');
    const coachingBtn = document.getElementById('coachingBtn');
    const exitQueueBtn = document.getElementById('exitQueueBtn');
    const saveBtn = document.getElementById('saveBtn');
    const saveNextBtn = document.getElementById('saveNextBtn');

    if (passReviewBtn) passReviewBtn.addEventListener('click', handlePassReview);
    if (correctionBtn) correctionBtn.addEventListener('click', handleCorrection);
    if (coachingBtn) coachingBtn.addEventListener('click', handleCoaching);
    if (exitQueueBtn) exitQueueBtn.addEventListener('click', handleExit);
    if (saveBtn) saveBtn.addEventListener('click', handleSave);
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

    // Voyage Details
    passenger.voyageDetails.voyageNumber = document.getElementById('voyageNumber')?.value || '';
    passenger.voyageDetails.bookingNumber = document.getElementById('bookingNumber')?.value || '';
    passenger.voyageDetails.currency = document.getElementById('currency')?.value || 'USD';

    // Waiver & Cancellation
    passenger.waiverCancellation.waiverReasonCode = document.getElementById('waiverReasonCode')?.value || '';
    passenger.waiverCancellation.waiverReasonDesc = document.getElementById('waiverReasonDesc')?.value || '';
    passenger.waiverCancellation.cancelCode = document.getElementById('cancelCode')?.value || '';
    passenger.waiverCancellation.refNotes = document.getElementById('refNotes')?.value || '';
}

function populateFormData() {
    const passengerKey = `passenger${FormState.currentPassenger}`;
    const passenger = FormState.formData[passengerKey];

    // Voyage Details
    const voyageNumberEl = document.getElementById('voyageNumber');
    const bookingNumberEl = document.getElementById('bookingNumber');
    const currencyEl = document.getElementById('currency');

    if (voyageNumberEl) voyageNumberEl.value = passenger.voyageDetails.voyageNumber || '';
    if (bookingNumberEl) bookingNumberEl.value = passenger.voyageDetails.bookingNumber || '';
    if (currencyEl) currencyEl.value = passenger.voyageDetails.currency || 'USD';

    // Waiver & Cancellation
    const waiverReasonCodeEl = document.getElementById('waiverReasonCode');
    const waiverReasonDescEl = document.getElementById('waiverReasonDesc');
    const cancelCodeEl = document.getElementById('cancelCode');
    const refNotesEl = document.getElementById('refNotes');

    if (waiverReasonCodeEl) waiverReasonCodeEl.value = passenger.waiverCancellation.waiverReasonCode || '';
    if (waiverReasonDescEl) waiverReasonDescEl.value = passenger.waiverCancellation.waiverReasonDesc || '';
    if (cancelCodeEl) cancelCodeEl.value = passenger.waiverCancellation.cancelCode || '';
    if (refNotesEl) refNotesEl.value = passenger.waiverCancellation.refNotes || '';

    FormState.isDirty = false;
}

function loadFormData() {
    const savedData = localStorage.getItem('hal-form-data');
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
    localStorage.setItem('hal-form-data', JSON.stringify(FormState.formData));
}

// ============================================
// FORM VALIDATION
// ============================================

function validateForm() {
    const requiredFields = [
        { id: 'voyageNumber', name: 'Voyage Number' },
        { id: 'bookingNumber', name: 'Booking Number' }
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
    // if (!validateForm()) return;

    showConfirmModal(
        'passReview',
        'Pass Review',
        () => {
            saveFormData();
            showNotification('Work item passed for review successfully!', 'success');
            setTimeout(() => {
                localStorage.removeItem('hal-form-data');
                location.reload();
            }, 2000);
        }
    );
}

function handleCorrection() {
    showConfirmModal(
        'correctionRequest',
        'Request Correction',
        () => {
            saveFormData();
            showNotification('Correction request sent!', 'success');
        }
    );
}

function handleCoaching() {
    showConfirmModal(
        'coachingEvent',
        'Coaching Request',
        () => {
            saveFormData();
            showNotification('Coaching request submitted!', 'success');
        }
    );
}

function handleExit() {
    showConfirmModal(
        'exitWorkQueue',
        'Exit Work Queue',
        'Are you sure you want to exit the queue? Unsaved changes will be lost.',
        () => {
            localStorage.removeItem('hal-form-data');
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

function showConfirmModal(modelType, title, onConfirm, message = 'Are you sure you want to proceed?') {
    const modal = document.getElementById(modelType);
    const modalTitle = modal.querySelector('#modalTitle');
    const modalMessage = modal.querySelector('#modalMessage');
    const confirmBtn = modal.querySelector("#confirmBtn");
    const cancelBtn = modal.querySelector("#cancelModalBtn");

    modalTitle.textContent = title;
   if(modalMessage) modalMessage.textContent = message;

    modal.classList.add('active');

    // Remove old listeners and add new ones
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        closeModal(modelType);
    });

    newCancelBtn.addEventListener('click', ()=>closeModal(modelType));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(modelType);
    });
}

function closeModal(modelType) {
    const modal = document.getElementById(modelType);
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
        FormState.formData.passenger1.voyageDetails = {
            voyageNumber: 'ABC123456',
            bookingNumber: 'ABC123456',
            currency: 'USD'
        };
        FormState.formData.passenger1.waiverCancellation = {
            waiverReasonCode: 'ILLNESS',
            waiverReasonDesc: 'COVID-19',
            cancelCode: 'CXL',
            refNotes: 'Global pandemic related cancellation'
        };
        populateFormData();
        saveFormData();
        console.log('Test data filled');
    },
    clearData: () => {
        localStorage.removeItem('hal-form-data');
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
        a.download = 'hal-form-data.json';
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
