// Elements
const travelAdvisorChip = document.getElementById("travelAdvisorChip");

const CUSTOMER = {
  travelAdvisor: "Cosco Travels",
  travelAdvisorImage: "/assets/traveladvisors/cosco.png",
};

let customer = {};

(function init() {
  customer = CUSTOMER;
  travelAdvisorChip.textContent = `🏢 Travel Advisor: ${customer.travelAdvisor}`;
})();