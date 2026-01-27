// Elements
const voyageTypeChip = document.getElementById("voyageTypeChip");
const loyaltyLevelDivs = document.querySelectorAll(".loyalty-level");

const CUSTOMER = {  
  ccn: "CCN-12345",
  loyalty: "5-Star Platinum",
  loyaltyLevel: "5",
  booking: {
    number: "B-123",
    date: "2025-11-05 09:30",
    bookingNotes: "Sample notes for the agent.",
  },
  voyageType: "WC",
  voyageTypeText: "World Cruise",
  voyageTypeImage: "/assets/voyageTypes/worldCruise.png",
};

let customer = {};

(function init() {
  customer = CUSTOMER;
  if (customer.booking) {
    voyageTypeChip.textContent = `${customer.voyageTypeText}`;
  }
})();

document.addEventListener("DOMContentLoaded", () => {
    renderStarRating(customer.loyaltyLevel)
});

function renderStarRating(rating) {
  loyaltyLevelDivs.forEach(loyalty => {
    loyalty.innerHTML = '';
    const validRating = Math.max(1, Math.min(5, rating));
    const starClass = validRating < 3 ? 'loyalty-silver-star' : validRating > 3 ? 'loyalty-platinum-star' : 'loyalty-gold-star';
    for (let i = 0; i < validRating; i++) {
      const star = document.createElement('i');
      star.className = `fa-solid fa-star ${starClass}`;
      loyalty.appendChild(star);
    }
  })
}