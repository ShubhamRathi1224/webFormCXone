import {
  BRANDS,
  customerIntents,
  cxOneAgents,
  deliverModes,
  SAMPLE_API_RESPONSES,
} from "../../data.js";

// Elements
const voyageTypeChip = document.getElementById("voyageTypeChip");
const loyaltyLevelDivs = document.querySelectorAll(".loyalty-level");
const copyrightYear = document.getElementById("copyrightYear");

const CUSTOMER = {
  brand: "holland",
  logo: "../../assets/logos/holland.svg",
  phoneType: "Mobile",
  phoneTypeImage: "/assets/phoneTypes/mobile.png",
  phone: "+15551234567",
  email: "sample@email.com",
  customerId: "C-0001",
  callerName: "John Doe",
  ccn: "CCN-12345",
  loyalty: "5-Star Platinum",
  loyaltyLevel: "5",
  callerType: "D",
  callerImage: "/assets/icons/guest.png",
  intent: "newBooking",
  intentImage: "/assets/intents/newBooking2.png",
  booking: {
    number: "B-123",
    date: "2025-11-05 09:30",

    bookingNotes: "Sample notes for the agent.",
  },
  voyageType: "WC",
  voyageTypeText: "World Cruise",
  voyageTypeImage: "/assets/voyageTypes/worldCruise.png",
  mediaType: "Voice",
  authenticated: true,
  authStatus: {
    authenticated: true,
    status: "AI authenticated",
    details: "Customer authenticated via security questions.",
  },
  lang: "en-US",
  langFlag: "/assets/flags/english.png",
  transcript: "I want to do a new booking for next month.",
  transferTo: "Support Queue",
  routeEmail: true,
  routeSMS: false,
  routeChat: true,
  termsAndConditions: [
    { value: "cancelPolicy", label: "Accept Cancellation Policy" },
    { value: "refundTerms", label: "Agree to Refund Terms" },
    { value: "privacyGDPR", label: "Acknowledge Privacy Policy (GDPR)" },
    { value: "promoConsent", label: "Consent to Promotional Communication" },
    { value: "liabilityWaiver", label: "Accept Liability Waiver" },
    {
      value: "insurancePolicy",
      label: "Acknowledge Travel Insurance Policy",
    },
    { value: "behaviorPolicy", label: "Accept Onboard Behavior Policy" },
    { value: "paymentAuth", label: "Agree to Payment Authorization" },
    { value: "contractTerms", label: "Accept Cruise Contract Terms" },
    {
      value: "healthSafety",
      label: "Consent to Health and Safety Protocols",
    },
  ],
};

let customer = {};

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
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
      // star.className = `fa-solid fa-star loyalty-star`;
      loyalty.appendChild(star);
    }
  })
}