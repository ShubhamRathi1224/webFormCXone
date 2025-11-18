// CXoneWebForm_new.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching logic
    const tabs = document.querySelectorAll('.cxone-form-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // Optionally, show/hide form sections based on tab
        });
    });

    // Cancel button logic
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        document.getElementById('cxoneSupportForm').reset();
    });

    // Submit logic (example only)
    document.getElementById('cxoneSupportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted!');
        // Add your form submission logic here
    });
});
