// Example: dynamic list of intents
export const customerIntents = [
  { value: "newBooking", label: "New Booking" },
  { value: "modifyBooking", label: "Modify Booking" },
  { value: "cancelBooking", label: "Cancel Booking" },
  { value: "billingIssue", label: "Billing Issue" },
  { value: "luggageLost", label: "Luggage Lost" },
  { value: "shoreExcursion", label: "Shore Excursion Inquiry" },
  { value: "onboardCredit", label: "Onboard Credit Issue" },
  { value: "specialAssistance", label: "Special Assistance Request" },
];

// Elements
const copyrightYear = document.getElementById("copyrightYear");

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();

  populateDropdown("intentSelector", customerIntents);
})();

function populateDropdown(selectId, data) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="" disabled>-- Select --</option>';
  data.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
}