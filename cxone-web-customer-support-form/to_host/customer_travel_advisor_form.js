// Elements
const travelAdvisorChip = document.getElementById("travelAdvisorChip");

const CUSTOMER = {
  travelAdvisor: "Cosco Travels",
};

let customer = {};

(function init() {
  customer = CUSTOMER;
  travelAdvisorChip.textContent = `🏢 Travel Advisor: ${customer.travelAdvisor}`;
})();