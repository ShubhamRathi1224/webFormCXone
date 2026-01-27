// Cruise brand metadata
const BRANDS = {
  holland: {
    theme: "holland",
    favicon: "../../assets/favicons/holland.png",
  },
  princess: {
    theme: "princess",
    favicon: "../../assets/favicons/princess.png",
  },
  seabourn: {
    theme: "seabourn",
    favicon: "../../assets/favicons/seabourn.png",
  },
  cunard: {
    theme: "cunard",
    favicon: "../../assets/favicons/cunard.png",
  },
};

const CUSTOMER = {
  brand: "holland",
  logo: "../../assets/logos/holland.svg",
  phoneType: "Mobile",
  phoneTypeImage: "/cxone-web-customer-support-form/to_host/images/phoneTypes/mobile.png",
  phone: "+15551234567",
  email: "sample@email.com",
  customerId: "C-0001",
  callerName: "John Doe",
  ccn: "CCN-12345",
  loyalty: "5-Star Platinum",
  loyaltyLevel: "5",
  callerType: "D",
  callerImage: "/cxone-web-customer-support-form/to_host/images/user.png",
  intent: "newBooking",
  intentImage: "/cxone-web-customer-support-form/to_host/images/intents/newBooking.png",
  booking: {
    number: "B-123",
    date: "2025-11-05 09:30",

    bookingNotes: "Sample notes for the agent.",
  },
  voyageType: "WC",
  voyageTypeText: "World Cruise",
  voyageTypeImage: "/cxone-web-customer-support-form/to_host/images/voyageTypes/worldCruise.png",
  mediaType: "Voice",
  authenticated: true,
  authStatus: {
    authenticated: true,
    status: "AI authenticated",
    details: "Customer authenticated via security questions.",
  },
  lang: "en-US",
  langFlag: "/cxone-web-customer-support-form/to_host/images/flags/english.png",
  transcript: "I want to do a new booking for next month.",
  transferTo: "Support Queue",
};

// Elements
const brandLogo = document.getElementById("brand-logo");
const phoneTypeDiv = document.getElementById("phoneTypeDiv");
const langFlagDiv = document.getElementById("langFlagDiv");
const authChip = document.getElementById("authChip");
const customerInfoTab = document.getElementById("customerInfoTab");
const travelAdvisorTab = document.getElementById("travelAdvisorTab");
const intentTab = document.getElementById("intentTab");
const bookingTab = document.getElementById("bookingTab");
const loyaltyLevelDivs = document.querySelectorAll(".loyalty-level");
const copyrightYear = document.getElementById("copyrightYear");

let customer = {};

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
  setCustomer();
})();

function setCustomer(customerId = "C-0001") {
  customer = CUSTOMER;
  // brandLogo.style.backgroundImage = `url(${customer.logo})`;

  setTheme(customer.brand);
  setPhoneType(phoneTypeDiv, customer.phoneType, customer.phoneTypeImage);
  setLangFlag(langFlagDiv, customer.lang, customer.langFlag);
  setAuthChip(customer.authenticated);

  if (customer.callerType == "D") {
    customerInfoTab.style.display = "block";
    travelAdvisorTab.style.display = "none";
    setTabDetails(customerInfoTab, "/cxone-web-customer-support-form/to_host/images/directGuest.png", "Direct Guest");
  } else {
    travelAdvisorTab.style.display = "block";
    customerInfoTab.style.display = "none";
    setTabDetails(
      travelAdvisorTab,
      customer.travelAdvisorImage,
      customer.travelAdvisor
    );
  }
  if (customer.intent) {
    setTabDetails(intentTab, customer.intentImage, customer.intent);
  }
  if (customer.booking) {
    setTabDetails(bookingTab, customer.voyageTypeImage, customer.voyageTypeText);
  }

  renderStarRating(customer.loyaltyLevel)
}

function setTheme(name = "holland") {
  document.documentElement.setAttribute("data-theme", name);
  const brand = BRANDS[name] || Object.values(BRANDS)[0];
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = brand.favicon;
}

function setPhoneType(elementDiv, phoneType = "Mobile", phoneTypeImage = "/cxone-web-customer-support-form/to_host/images/phoneTypes/mobile.png") {
  if (!elementDiv) return;
  elementDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = phoneTypeImage;
  img.alt = `${phoneType} image`;
  elementDiv.appendChild(img);
}

function setLangFlag(elementDiv, lang = "en-US", langFlag = "/cxone-web-customer-support-form/to_host/images/flags/english.png") {
  if (!elementDiv) return;
  elementDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = langFlag;
  img.alt = `${lang} image`;
  elementDiv.appendChild(img);
}

function setAuthChip(isAuthenticated) {
    authChip.innerHTML =
      `<span class="auth-icon ${isAuthenticated ? 'check' : 'cross'}"> ${isAuthenticated ? svgCheck(): svgCross()}
      </span><span><strong>${isAuthenticated ? 'Authenticated' : 'Unauthenticated'}</strong></span>`;
    authChip.title = customer.authStatus ? customer.authStatus.details : '';
}

function svgCheck() {
  return '<i class="fa-solid fa-check"></i>';
}
function svgCross() {
  return '<i class="fa-solid fa-xmark"></i>';
}

function setTabDetails(selectedTab, src = "/cxone-web-customer-support-form/to_host/images/directGuest.png", alt = 'Direct Guest') {
  const titleDiv = selectedTab.querySelector(".cxone-tab-title");
  titleDiv.textContent = alt;
  const iconDiv = selectedTab.querySelector(".cxone-tab-icon");
  iconDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.width = 200;
  img.width = "-webkit-fill-available";
  img.height = 200;
  img.style.objectFit = "contain";
  iconDiv.appendChild(img);
}

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
