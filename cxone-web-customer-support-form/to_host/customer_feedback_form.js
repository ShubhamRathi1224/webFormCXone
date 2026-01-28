// Cruise brand metadata
const BRANDS = {
  hal: {
    favicon: "../../assets/favicons/holland.png",
  },
  pcl: {
    favicon: "../../assets/favicons/princess.png",
  },
  sbn: {
    favicon: "../../assets/favicons/seabourn.png",
  },
  cun: {
    favicon: "../../assets/favicons/cunard.png",
  },
};

const CUSTOMER = {
  loyalty: "5-Star Platinum",
  loyaltyLevel: "5",
  mediaType: "Voice",
  authStatus: {
    status: "AI authenticated",
    details: "Customer authenticated via security questions.",
  },
  travelAdvisor: "Cosco Travels",
  travelAdvisorImage: "/cxone-web-customer-support-form/to_host/images/travelAdvisors/cosco.png",
};

// images
const directGuestImage = "/cxone-web-customer-support-form/to_host/images/directGuest.png";
const germanFlagImage = "/cxone-web-customer-support-form/to_host/images/flags/german.png";
const dutchFlagImage = "/cxone-web-customer-support-form/to_host/images/flags/dutch.png";
const englishFlagImage = "/cxone-web-customer-support-form/to_host/images/flags/english.png";
const mobilePhoneImage = "/cxone-web-customer-support-form/to_host/images/phoneTypes/mobile.png";
const landlinePhoneImage = "/cxone-web-customer-support-form/to_host/images/phoneTypes/landline.png";
const intentsImages = "/cxone-web-customer-support-form/to_host/images/intents/";
const voyageTypesImages = "/cxone-web-customer-support-form/to_host/images/voyageTypes/";

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

function setCustomer() {
  customer = CUSTOMER;
  // brandLogo.style.backgroundImage = `url(${customer.logo})`;

  setTheme();
  setPhoneType();
  setLangFlag();
  setAuthChip();

  if (document.getElementById("callerType").value == "D") {
    customerInfoTab.style.display = "block";
    travelAdvisorTab.style.display = "none";
    setTabDetails(customerInfoTab, directGuestImage, "Direct Guest");
  } else {
    travelAdvisorTab.style.display = "block";
    customerInfoTab.style.display = "none";
    setTabDetails(
      travelAdvisorTab,
      customer.travelAdvisorImage,
      customer.travelAdvisor
    );
  }
  const intent =  document.getElementById("intent").value || 'isNewBooking';
  if (intent) {
    const intentImage  = `${intentsImages}${intent}.png`;
    setTabDetails(intentTab, intentImage, intent);
  }
  const voyageType =  document.getElementById("voyageType").value || 'BC'; // BC/CB/GV/WC/TBD(Inter something)
  if (voyageType) {
    const voyageTypeImage  = `${voyageTypesImages}${voyageType.toLowerCase()}.png`;
    document.getElementById("voyageTypeBasic").src = voyageTypeImage;
    setTabDetails(bookingTab, voyageTypeImage, voyageType);
  }

  renderStarRating(customer.loyaltyLevel)
}

function setTheme() {
  const brandName = document.getElementById("brand").value.toLowerCase() || "hal";
  document.documentElement.setAttribute("data-theme", brandName);
  const brandConfig = BRANDS[brandName] || Object.values(BRANDS)[0];
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = brandConfig.favicon;
}

function setPhoneType() {
  const isMobile = document.getElementById("isMobile").value == 1 ;
  const altText = isMobile ? "Mobile" : "Landline";
  const voiceTypeImage = isMobile ? mobilePhoneImage : landlinePhoneImage;
  if (!phoneTypeDiv) return;
  phoneTypeDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = voiceTypeImage;
  img.alt = `${altText} image`;
  phoneTypeDiv.appendChild(img);
}

function setLangFlag() {
  const lang = document.getElementById("lang").value;
  const langFlag = lang.startsWith('de') ?  germanFlagImage : lang.startsWith('nl') ?  dutchFlagImage : englishFlagImage;
  if (!langFlagDiv) return;
  langFlagDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = langFlag;
  img.alt = `${lang} image`;
  langFlagDiv.appendChild(img);
}

function setAuthChip() {
  const isAuthenticated = document.getElementById("authenticated").value.toLowerCase() == 'yes' ;
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

function setTabDetails(selectedTab, src = directGuestImage, alt = 'Direct Guest') {
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
