// CXoneWebForm_modern.js

document.addEventListener('DOMContentLoaded', function() {
    // Star rating rendering
    const ratingContainer = document.getElementById('cxone-rating');
    if (ratingContainer) {
        const rating = 4.5; // out of 5
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                ratingContainer.innerHTML += '<span>★</span>';
            } else if (i - rating < 1) {
                ratingContainer.innerHTML += '<span style="position:relative;display:inline-block;width:1em;overflow:hidden;">' +
                    '<span style="position:absolute;left:0;width:50%;overflow:hidden;">★</span>' +
                    '<span style="color:#ccc;">★</span>' +
                '</span>';
            } else {
                ratingContainer.innerHTML += '<span style="color:#ccc;">★</span>';
            }
        }
    }

    // Intent button toggle
    const intentBtns = document.querySelectorAll('.cxone-intent-btn');
    intentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            intentBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Cancel button
    document.querySelector('.cxone-cancel').addEventListener('click', function() {
        window.location.reload();
    });

    // Save & Next button
    document.querySelector('.cxone-save').addEventListener('click', function() {
        alert('Form saved! (Demo only)');
    });
});
