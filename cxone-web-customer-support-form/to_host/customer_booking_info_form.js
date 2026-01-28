// Elements
const voyageTypeChip = document.getElementById("voyageTypeChip");
const loyaltyLevelDivs = document.querySelectorAll(".loyalty-level");

const CUSTOMER = {  
  loyalty: "5-Star Platinum",
  loyaltyLevel: "5"
};

let customer = {};

(function init() {
  customer = CUSTOMER;
  if (document.getElementById("voyageType").value) {
    voyageTypeChip.textContent = `🚢 Voyage Type: ${document.getElementById("voyageType").value}`;
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