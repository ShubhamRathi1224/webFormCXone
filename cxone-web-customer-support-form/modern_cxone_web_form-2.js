import {
  BRANDS,
  customerIntents,
  cxOneAgents,
  deliverModes,
  SAMPLE_API_RESPONSES,
} from "../data.js";

// Elements
const phoneTypeDiv = document.getElementById("phoneTypeDiv");
const phoneTypeField = document.getElementById("phoneTypeField");
const langFlagDiv = document.getElementById("langFlagDiv");
const authChip = document.getElementById("authChip");
const customerSelector = document.getElementById("customerSelector");
const serviceSelector = document.getElementById("serviceSelector");
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
const serviceFooterName = document.getElementById("serviceFooterName");
const serviceFooterTagline = document.getElementById("serviceFooterTagline");
const copyrightYear = document.getElementById("copyrightYear");
const basicDetails = document.getElementById('basicDetails');
const loyaltyLevelDivs = document.querySelectorAll(".loyalty-level");

let customer = {};

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
  setCustomer();
})();

document.addEventListener("DOMContentLoaded", () => {
  serviceSelector.addEventListener("change", (e) => {
    setTheme(e.target.value);
  });

  customerSelector.addEventListener("change", (e) => {
    setCustomer(e.target.value);
  });
  
  // intentSelector.addEventListener("change", handleIntentChange);
});

function setCustomer(customerId = "C-0001") {
  customer = SAMPLE_API_RESPONSES.find((c) => c.customerId === customerId);

  setTheme(customer.brand);
  setPhoneType(phoneTypeDiv, customer.phoneType, customer.phoneTypeImage);
  setPhoneType(phoneTypeField, customer.phoneType, customer.phoneTypeImage);
  setLangFlag(langFlagDiv, customer.lang, customer.langFlag);
  setAuthChip(customer.authenticated);

  if (customer.callerType == "D") {
    customerInfoTab.style.display = "block";
    travelAdvisorTab.style.display = "none";
    setTabDetails(customerInfoTab, "/assets/directGuest.png", "Direct Guest");
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
  populateDeliverModes(customer);
  populateFromIVR(customer);
  updateNextEnabled();
}

function setTheme(name = "holland") {
  document.documentElement.setAttribute("data-theme", name);
  serviceSelector.value = name;

  const brand = BRANDS[name] || Object.values(BRANDS)[0];
  serviceFooterName.textContent = brand.name;
  serviceFooterTagline.textContent = brand.tag;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = brand.favicon;
}

function setPhoneType(elementDiv, phoneType = "Mobile", phoneTypeImage = "/assets/phoneTypes/mobile.png") {
  if (!elementDiv) return;
  elementDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = phoneTypeImage;
  img.alt = `${phoneType} image`;
  elementDiv.appendChild(img);
}

function setLangFlag(elementDiv, lang = "en-US", langFlag = "/assets/flags/english.png") {
  if (!elementDiv) return;
  elementDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = langFlag;
  img.alt = `${lang} image`;
  elementDiv.appendChild(img);
}

function setAuthChip(isAuthenticated) {
  authChip.innerHTML =
    `<span class="icon ${isAuthenticated ? 'check' : 'cross'}"> ${isAuthenticated ? svgCheck(): svgCross()}
    </span><span><strong>${isAuthenticated ? 'Authenticated' : 'Unauthenticated'}</strong></span>`;
  authChip.title = customer.authStatus ? customer.authStatus.details : '';
}

function svgCheck() {
  return '<i class="fa-solid fa-check"></i>';
}
function svgCross() {
  return '<i class="fa-solid fa-xmark"></i>';
}

function setTabDetails(selectedTab, src = "/assets/directGuest.png", alt = 'Direct Guest') {
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

function populateTransferModes(customer) {
  var deliverModesOption = [ 
    { value: "skillSet", label: "Skill Set" },
    { value: "consuktant", label: "PCC" },
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
  const selected = e.target.value; // email or chat
  const targetEl = document.getElementById("pccNameField");

  if (selected === "skillSet") {
    targetEl.style.display = "none";      // hide on "email"
  } else {
    targetEl.style.display = "block";     // show on "chat"
  }
}

function populateDeliverModes(customer) {
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
  
  serviceSelector.value = payload.brand || "";
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

  // setBasicDetails(mainBasicDetails);
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
      // star.className = `fa-solid fa-star loyalty-star`;
      loyalty.appendChild(star);
    }
  })
}

function setBasicDetails(mainBasicDetails){
  const fieldLabels = {
    callerName: 'Customer Name',
    ccn: 'CCN',
    travelAdvisor: 'Travel Advisor',
    intent: 'Intent',
    bookingNumber: 'Booking Number',
    bookingDate: 'Booking Date',
    loyalty: 'Loyalty',
    voyageType: 'Voyage Type'
  }
  const fieldIcons = {
    callerName: '<i class="fa-regular fa-user"></i>',
    ccn: '<i class="fa-regular fa-address-card"></i>',
    travelAdvisor: '<i class="fa-solid fa-user-tie"></i>',
    intent: '<i class="fa-solid fa-list-check"></i>',
    bookingNumber: '<i class="fa-solid fa-hashtag"></i>',
    bookingDate: '<i class="fa-regular fa-calendar"></i>',
    loyalty: '<i class="fa-regular fa-star"></i>',
    voyageType: '<i class="fa-solid fa-ship"></i>'
  }

  const htmlContent = Object.keys(mainBasicDetails)
    .map(key => `
      <div class="field">
        <p>${fieldIcons[key]}: <span id="${key}TextBasic">${mainBasicDetails[key] || 'NA'}</span></p>
      </div>
    `)
    .join('');
    // basicDetails.innerHTML = htmlContent;
    basicDetails.innerHTML = `
      <div class="short-row">
        ${htmlContent}
      </div>
    `
}

function handleIntentChange() {
  console.log("handleIntentChange: ");
}

// searchable autocomplete multi-select dropdown start

const termSearchInput = document.getElementById("termSearch");
const optionsList = document.getElementById("termOptions");
const selectedTagsContainer = document.getElementById("selectedTags");

let selectedTerms = [];

function renderOptions(filter = "") {
  optionsList.innerHTML = "";
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
    optionsList.appendChild(div);
  });
  optionsList.style.display = filtered.length ? "block" : "none";
}

function selectTerm(term) {
  selectedTerms.push(term);
  renderTags();
  termSearchInput.value = "";
  renderOptions();
}

function renderTags() {
  selectedTagsContainer.innerHTML = "";
  selectedTerms.forEach((term) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = term.label;
    const icon = document.createElement("i");
    icon.className = "fa fa-times";
    icon.onclick = () => removeTerm(term);
    tag.appendChild(icon);
    selectedTagsContainer.appendChild(tag);
  });
}

function removeTerm(term) {
  selectedTerms = selectedTerms.filter((t) => t.label !== term.label);
  renderTags();
  renderOptions();
}

termSearchInput.addEventListener("focus", () => renderOptions());
termSearchInput.addEventListener("input", (e) => renderOptions(e.target.value));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#termSearch")) {
    optionsList.style.display = "none";
    termSearchInput.value = "";
  }
});

// searchable autocomplete multi-select dropdown end

// searchable autocomplete single-select dropdown start

const searchInput = document.getElementById("transferSearch");
const optionsContainer = document.getElementById("transferOptions");
const hiddenSelect = document.getElementById("transferTo");

// Render all options initially
function renderOptions1(filter = "") {
  optionsContainer.innerHTML = "";
  const filtered = cxOneAgents.filter((a) =>
    a.label.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach((a) => {
    const div = document.createElement("div");
    div.className = "option-item";
    div.textContent = a.label;
    div.dataset.value = a.value;
    div.addEventListener("click", () => selectOption(a));
    optionsContainer.appendChild(div);
  });
  optionsContainer.style.display = filtered.length ? "block" : "none";
}

function selectOption(agent) {
  searchInput.value = agent.label;
  hiddenSelect.value = agent.value;
  optionsContainer.style.display = "none";
}

// Filter as user types
searchInput.addEventListener("input", (e) => {
  renderOptions1(e.target.value);
});

// Open options on focus
searchInput.addEventListener("focus", () => renderOptions1(""));

// Close options when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#transferSearch")) {
    optionsContainer.style.display = "none";
  }
});

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

const userWrapper = document.querySelector(".user-img-wrapper");
const wrongUserInput = document.getElementById("wrongUser");

userWrapper.addEventListener("click", () => {
    userWrapper.classList.toggle("wrong");
    wrongUserInput.value = userWrapper.classList.contains("wrong") ? "1" : "0";
});

document.querySelectorAll(".subscription-type").forEach(type => {
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
