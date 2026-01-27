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

// Example: dynamic list of intents
const customerIntents = [
  { value: "newBooking", label: "New Booking" },
  { value: "modifyBooking", label: "Modify Booking" },
  { value: "cancelBooking", label: "Cancel Booking" },
  { value: "billingIssue", label: "Billing Issue" },
  { value: "luggageLost", label: "Luggage Lost" },
  { value: "shoreExcursion", label: "Shore Excursion Inquiry" },
  { value: "onboardCredit", label: "Onboard Credit Issue" },
  { value: "specialAssistance", label: "Special Assistance Request" },
];

const cxOneAgents = [
  { value: "agent1", label: "Agent 1" },
  { value: "agent2", label: "Agent 2" },
  { value: "agent3", label: "Agent 3" },
  { value: "agent4", label: "Agent 4" },
  { value: "agent5", label: "Agent 5" },
];

const cxOneSkills = [
  { value: "skill1", label: "Skill 1" },
  { value: "skill2", label: "Skill 2" },
  { value: "skill3", label: "Skill 3" },
  { value: "skill4", label: "Skill 4" },
  { value: "skill5", label: "Skill 5" },
];

// Example: Deliver mode options
const deliverModes = [
  { value: "spoken", label: "Spoken", isTextIncluded: false },
  { value: "text", label: "Text", isTextIncluded: true },
  { value: "both", label: "Both Spoken and Text", isTextIncluded: true },
];

const CUSTOMER = {
  brand: "seabourn",
  logo: "../../assets/logos/seabourn.svg",
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

// Elements
const brandLogo = document.getElementById("brand-logo");
const phoneTypeDiv = document.getElementById("phoneTypeDiv");
const phoneTypeField = document.getElementById("phoneTypeField");
const langFlagDiv = document.getElementById("langFlagDiv");
const authChip = document.getElementById("authChip");
const customerInfoTab = document.getElementById("customerInfoTab");
const travelAdvisorTab = document.getElementById("travelAdvisorTab");
const travelAdvisorChip = document.getElementById("travelAdvisorChip");
const intentTab = document.getElementById("intentTab");
const intentSelector = document.getElementById("intentSelector");
const bookingTab = document.getElementById("bookingTab");
const voyageTypeChip = document.getElementById("voyageTypeChip");
const bookingNumber = document.getElementById("bookingNumber");
const bookingDate = document.getElementById("bookingDate");
const bookingNotes = document.getElementById("bookingNotes");
const transcript = document.getElementById("transcript");
const btnNext = document.getElementById("btnNext");
const btnCancel = document.getElementById("btnCancel");
const copyrightYear = document.getElementById("copyrightYear");
const loyaltyLevelDivs = document.querySelectorAll(".loyalty-level");

let customer = {};
let transferList = JSON.parse(JSON.stringify(cxOneAgents));

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
  setCustomer();
})();

document.addEventListener("DOMContentLoaded", () => {
  // intentSelector.addEventListener("change", handleIntentChange);
});

function setCustomer() {
  customer = CUSTOMER;
  brandLogo.style.backgroundImage = `url(${customer.logo})`;
  setTheme(customer.brand);
  setPhoneType(phoneTypeDiv, customer.phoneType, customer.phoneTypeImage);
  setPhoneType(phoneTypeField, customer.phoneType, customer.phoneTypeImage);
  setLangFlag(langFlagDiv, customer.lang, customer.langFlag);
  setAuthChip(customer.authenticated);

  if (customer.callerType == "D") {
    customerInfoTab.style.display = "block";
    travelAdvisorTab.style.display = "none";
    setTabDetails(customerInfoTab, "/cxone-web-customer-support-form/to_host/images/directGuest.png", "Direct Guest");
  } else {
    travelAdvisorTab.style.display = "block";
    travelAdvisorChip.textContent = `🏢 Travel Advisor: ${customer.travelAdvisor}`;
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
    voyageTypeChip.textContent = `${customer.voyageTypeText}`;
    setTabDetails(bookingTab, customer.voyageTypeImage, customer.voyageTypeText);
  }

  populateDropdown("intentSelector", customerIntents);
  populateTransferModes(customer);
  populateTnCDeliverModes(customer);
  populateFromIVR(customer);
  updateNextEnabled();
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
  iconDiv.appendChild(img);
}

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

function populateTransferModes(customer) {
  var deliverModesOption = [ 
    { value: "skillSet", label: "Skill Set" },
    { value: "consultant", label: "PCC" },
  ];
  const group = document.getElementById("transferModeGroup");
  group.innerHTML = "";

  deliverModesOption.forEach((mode) => {
    const wrapper = document.createElement("label");
    wrapper.className = "radio-option";
    wrapper.style.display = "block";
    wrapper.style.cursor = "pointer";
    wrapper.setAttribute("for", `transferMode_${mode.value}`);

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "transferMode";
    input.value = mode.value;
    input.id = `transferMode_${mode.value}`;


    input.addEventListener("change", onTransferModeChange);
    const text = document.createTextNode(" " + mode.label);

    wrapper.appendChild(input);
    wrapper.appendChild(text);
    group.appendChild(wrapper);
  });
}

function onTransferModeChange(e){
  const selected = e.target.value;

  if (selected === "skillSet") {
    document.querySelector('label[for="transferTo"]').innerText = 'Skill Name';
    transferList = JSON.parse(JSON.stringify(cxOneSkills));
  } else {
    document.querySelector('label[for="transferTo"]').innerText = 'PCC Name';
    transferList = JSON.parse(JSON.stringify(cxOneAgents));
  }
}

function populateTnCDeliverModes(customer) {
  var deliverModesOption = [...deliverModes];
  if (!(customer.routeEmail || customer.routeSMS || customer.routeChat)) {
    deliverModesOption = deliverModesOption.filter(
      (mode) => !mode.isTextIncluded
    );
  }
  const group = document.getElementById("deliverModeGroup");
  group.innerHTML = "";

  deliverModesOption.forEach((mode) => {
    const wrapper = document.createElement("label");
    wrapper.className = "radio-option";
    wrapper.style.display = "block";
    wrapper.style.cursor = "pointer";
    wrapper.setAttribute("for", `deliverMode_${mode.value}`);

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "deliverMode";
    input.value = mode.value;
    input.id = `deliverMode_${mode.value}`;
    
    if (!(customer.routeEmail || customer.routeSMS || customer.routeChat)) {
      input.checked = true;
    }

    const text = document.createTextNode(" " + mode.label);

    wrapper.appendChild(input);
    wrapper.appendChild(text);
    group.appendChild(wrapper);
  });
}

function populateFromIVR(payload) {
  if (!payload) return;
  let mainBasicDetails = {
    intent: payload.intent,
    bookingNumber: payload.booking.number,
    bookingDate: payload.booking.date,
    loyalty: payload.loyalty,
    voyageType: payload.voyageTypeText,
  }
  if(payload.callerType === "D") {
    document.getElementById("callerNameText").innerText = payload.callerName || "";
    document.getElementById("ccnText").innerText = payload.ccn || "";
    mainBasicDetails = {
      // customerId: payload.customerId,
      callerName: payload.callerName,
      ccn: payload.ccn,
      ...mainBasicDetails,
    }
  } else {
    document.getElementById("iataText").innerText = payload.travelAdvisorInfo.iata || "";
    document.getElementById("cliaText").innerText = payload.travelAdvisorInfo.clia || "";
    document.getElementById("agencyIdText").innerText = payload.travelAdvisorInfo.agencyId || "";
    document.getElementById("agencyNumberText").innerText = payload.travelAdvisorInfo.agencyName || "";
    mainBasicDetails = {
      travelAdvisor: payload.travelAdvisor,
      ...mainBasicDetails,
    }
  }
  document.getElementById("intentText").innerText = payload.intent || "";
  document.getElementById("transcriptText").innerText = payload.transcript || "";
  document.getElementById("bookingNumberText").innerText = payload.booking.number || "";
  document.getElementById("bookingDateText").innerText = payload.booking.date || "";
  document.getElementById("bookingNotesText").innerText = payload.booking.bookingNotes || "";
  renderStarRating(payload.loyaltyLevel)
  
  if (payload.intent) {
    intentSelector.value = payload.intent;
    handleIntentChange();
  } else {
    intentSelector.value = "";
  }
  if (payload.booking) {
    bookingNumber.value = payload.booking.number || "";
    bookingDate.value = payload.booking.date || "";
    bookingTab.style.display = "block";
    bookingNotes.value = payload.booking.bookingNotes;
  }
  transcript.value = payload.transcript || "";
}

function updateNextEnabled() {
  btnNext.disabled = !intentSelector.value;
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

function handleIntentChange() {
  console.log("handleIntentChange: ");
}

// searchable autocomplete multi-select T&C dropdown start

const termSearchInput = document.getElementById("termSearch");
const termOptionsList = document.getElementById("termOptions");
const selectedTnCTagsDiv = document.getElementById("selectedTnCTags");

let selectedTerms = [];

function renderTnCOptions(filter = "") {
  termOptionsList.innerHTML = "";
  const filtered = customer.termsAndConditions.filter(
    (t) =>
      t.label.toLowerCase().includes(filter.toLowerCase()) &&
      !selectedTerms.some((term) => term.label === t.label)
  );
  filtered.forEach((term) => {
    const div = document.createElement("div");
    div.className = "option-item";
    div.textContent = term.label;
    div.onclick = () => selectTerm(term);
    termOptionsList.appendChild(div);
  });
  termOptionsList.style.display = filtered.length ? "block" : "none";
}

function selectTerm(term) {
  selectedTerms.push(term);
  renderTnCTags();
  termSearchInput.value = "";
  renderTnCOptions();
}

function renderTnCTags() {
  selectedTnCTagsDiv.innerHTML = "";
  selectedTerms.forEach((term) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = term.label;
    tag.style.cssText = `background: ${window.global?.primaryColor};`;
    const icon = document.createElement("i");
    icon.className = "fa fa-times";
    icon.onclick = () => removeTerm(term);
    tag.appendChild(icon);
    selectedTnCTagsDiv.appendChild(tag);
  });
}

function removeTerm(term) {
  selectedTerms = selectedTerms.filter((t) => t.label !== term.label);
  renderTnCTags();
  renderTnCOptions();
}

termSearchInput.addEventListener("focus", () => renderTnCOptions());
termSearchInput.addEventListener("input", (e) => renderTnCOptions(e.target.value));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#termSearch")) {
    termOptionsList.style.display = "none";
    termSearchInput.value = "";
  }
});

// searchable autocomplete multi-select T&C dropdown end

// searchable autocomplete single-select transfer dropdown start

const transferSearchInput = document.getElementById("transferSearch");
const transferOptionsDiv = document.getElementById("transferOptions");
const transferToInput = document.getElementById("transferTo");

function renderTransferOptions(filter = "") {
  transferOptionsDiv.innerHTML = "";
  const filtered = transferList.filter((a) =>
    a.label.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach((a) => {
    const div = document.createElement("div");
    div.className = "option-item";
    div.textContent = a.label;
    div.dataset.value = a.value;
    div.addEventListener("click", () => selectTransferOption(a));
    transferOptionsDiv.appendChild(div);
  });
  transferOptionsDiv.style.display = filtered.length ? "block" : "none";
}

function selectTransferOption(agent) {
  transferSearchInput.value = agent.label;
  transferToInput.value = agent.value;
  transferOptionsDiv.style.display = "none";
}

transferSearchInput.addEventListener("input", (e) => {
  renderTransferOptions(e.target.value);
});

transferSearchInput.addEventListener("focus", () => renderTransferOptions(""));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#transferSearch")) {
    transferOptionsDiv.style.display = "none";
  }
});

// searchable autocomplete single-select transfer dropdown end

const userWrapper = document.querySelector(".user-img-wrapper");
const wrongUserInput = document.getElementById("wrongUser");

userWrapper.addEventListener("click", () => {
    userWrapper.classList.toggle("wrong");
    wrongUserInput.value = userWrapper.classList.contains("wrong") ? "1" : "0";
});

document.querySelectorAll(".sms-auth-type").forEach(type => {
    type.addEventListener("click", () => {
        const isActive = type.classList.toggle("active");
        type.dataset.title = isActive 
            ? "Customer authorized for this"
            : "Customer not authorized" ;
          isActive ? type.setAttribute('title','Customer authorized for this') :  type.setAttribute('title','Customer not authorized');
    });
});




btnCancel.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    console.log("Changes discarded.");
  }
});

btnNext.addEventListener("click", () => {
  if (btnNext.disabled) return;
  const data = {
    brand: customer.value,
    intent: intentSelector.value,
    booking: { number: bookingNumber.value, date: bookingDate.value, bookingNotes: bookingNotes.value,},
    routes: {
      email: document.getElementById("mediaMail").checked,
      email: document.getElementById("mediaMessage").checked,
      sms: document.getElementById("mediaChat").checked,
      chat: document.getElementById("mediaSMS").checked,
    },
    transferTo: document.getElementById("transferTo").value,
    timestamp: new Date().toISOString(),
  };

  // const submission = {
  //   brand: service,
  //   customerId,
  //   callerName,
  //   ccn,
  //   travelAdvisor: customer.travelAdvisor || null,
  //   iata,
  //   clia,
  //   agencyId,
  //   agencyName,
  //   intent,
  //   satisfied,
  //   transcript,
  //   booking: { number: bookingNumber, date: bookingDate, bookingNotes, },
  //   transferTo,
  //   mediaType,
  //   routes,
  //   phoneType: customer.phoneType || null,
  //   lang: customer.lang || null,
  //   authenticated: customer.authenticated || false,
  //   timestamp: new Date().toISOString(),
  // };
  console.log("data:", data);
  alert("Saved locally");

  // // method:1
  // // Send data back to Studio // CXone SDK messaging.
  // await window.CXone.sendMessage({
  // 	type: "FormSubmit",
  // 	data: formData
  // });

  // // method:2
  // // Call a CXone “REST API” from
  // await fetch(`https://api-cxone.incontact.com/incontactapi/services/v21.0/contacts/${contact.id}/custom-data`, {
  // 	method: "POST",
  // 	headers: {
  // 		"Authorization": `Bearer ${token}`,
  // 		"Content-Type": "application/json"
  // 	},
  // 	body: JSON.stringify({
  // 		customData: {
  // 		newCustomerName,
  // 		agentAuth,
  // 		transferNotes
  // 		}
  // 	})
  // });

  // // method:3  //  Redirect or call a webhook
  // // You can also just redirect to another URL that CXone monitors.
  // // That webhook can update CXone contact data or trigger next Studio step via API.
  // window.location.href = `https://yourapi/next-step?customer=${customerName}&auth=${agentAuth}`;
});



const tabs = document.querySelectorAll(".cxone-tab");
const panels = document.querySelectorAll(".cxone-form-panel");
const modal = document.getElementById("cxoneModal");
const modalTitle = document.getElementById("cxoneModalTitle");
const modalBody = document.getElementById("cxoneModalBody");
const closeBtn = document.querySelector(".cxone-close");
const updateInfoBtn = document.getElementById("updateInfoButton");

function showPanel(tabName, tabTitle = 'Confirm') {
    panels.forEach(p => {
        p.style.display = p.dataset.tab === tabName ? 'block' : 'none';
    });
    const panel = document.querySelector(`.cxone-form-panel[data-tab="${tabName}"]`);
    console.log('panel: ', panel);
    if (panel) {
        modal.style.display = "block";
        modalTitle.textContent = tabTitle;
        // const first = panel.querySelector('input, textarea, select');
        // if (first) first.focus();
    }
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        console.log('tab: ', tab);
        const tabName = tab.getAttribute("data-tab");
        console.log('tabName: ', tabName);
        const descElement = tab.querySelector('.cxone-tab-desc');
        const titleText = descElement ? descElement.textContent.trim() : '';
        showPanel(tabName, titleText);
    });
});

updateInfoBtn.addEventListener("click", () => {
    showPanel('updateCallInformation','Update Call Information');
});

closeBtn.onclick = () => (modal.style.display = "none");
// window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
// const initialTab = document.querySelector('.cxone-tab.selected');
// if (initialTab) showPanel(initialTab.dataset.tab);

const thumbs = document.querySelectorAll(".thumb");
const hiddenSatisfiedInput = document.getElementById("satisfied");
thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
        thumbs.forEach(t => t.classList.remove("selected"));
        thumb.classList.add("selected");
        hiddenSatisfiedInput.value = thumb.dataset.value;
    });
});