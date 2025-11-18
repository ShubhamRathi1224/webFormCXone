// CXoneWebForm_service_log.js

document.addEventListener('DOMContentLoaded', function() {
    // Star rating logic
    const stars = document.querySelectorAll('#starRating span');
    let selectedRating = 5;
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            highlightStars(this.dataset.value);
        });
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
        star.addEventListener('click', function() {
            selectedRating = this.dataset.value;
            highlightStars(selectedRating);
        });
    });
    function highlightStars(rating) {
        stars.forEach(star => {
            if (parseInt(star.dataset.value) <= rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }
    highlightStars(selectedRating);

    // Form submit handler
    document.getElementById('serviceLogForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Collect form data
        const data = {
            name: document.getElementById('name').value,
            ccn: document.getElementById('ccn').value,
            advisor: document.getElementById('advisor').checked,
            intent: document.getElementById('intent').value,
            rating: selectedRating,
            satisfied: document.getElementById('satisfied').checked,
            details: document.getElementById('details').value,
            bookingNumber: document.getElementById('bookingNumber').value,
            customer: document.getElementById('customer').value,
            mediaType: document.querySelector('input[name="mediaType"]:checked').value
        };
        // For demo, just log the data
        console.log('Form submitted:', data);
        alert('Form submitted! (See console for data)');
        // Optionally, reset form
        // this.reset();
    });
});
