import { BRANDS, customerIntents, cxOneAgents, deliverModes, SAMPLE_API_RESPONSES } from "./data.js";

// Elements
const serviceSelector = document.getElementById("serviceSelector");
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
const serviceFooterName = document.getElementById("serviceFooterName");

// --- ENV and Sample API Response ---
let customer = "";

(function init() {
  document.getElementById("copyrightYear").textContent =
    new Date().getFullYear();
  setCustomer();
})();

function setTheme(name = "holland") {
  localStorage.setItem("theme", name);
  document.documentElement.setAttribute("data-theme", name);
  serviceSelector.value = name;

  const brand = BRANDS[name] || Object.values(BRANDS)[0];
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = brand.favicon;
}

function loadSavedTheme() {
  const saved = localStorage.getItem("theme");
  setTheme(saved);
}

function setCustomer(customerId = "C-0001") {
  customer = SAMPLE_API_RESPONSES.find((c => c.customerId === customerId));
  
  populateDropdown("intentSelector", customerIntents);
  
  if(customer.callerType=="D"){
    customerInfoTab.style.display="block";
    travelAdvisorTab.style.display="none";
    setTabDetails(customerInfoTab, "/assets/directGuest.png", "Direct Guest");
  } else {
    travelAdvisorTab.style.display="block";
    travelAdvisorChip.textContent = `🏢 Travel Advisor: ${customer.travelAdvisor}`;
    customerInfoTab.style.display="none";
    setTabDetails(travelAdvisorTab, customer.travelAdvisorImage, customer.travelAdvisor);
  }
  if(customer.intent){
    setTabDetails(intentTab, customer.intentImage, customer.intent);
  }
  if(customer.booking){
    voyageTypeChip.textContent = `🏢 Voyage Type: ${customer.voyageType}`;
    setTabDetails(bookingTab, customer.voyageTypeImage, customer.voyageType);
  }

  setTheme(customer.brand);
  setAuthChip(customer.authenticated);
  populateFromIVR(customer);
  if (customer.lang) setLangFlag(customer.lang, customer.langFlag);
  setPhoneType(customer.phoneType, customer.phoneTypeImage);
  populateDeliverModes(customer);
  updateNextEnabled();
}

function populateDeliverModes(customer) {
  var deliverModesOption = [...deliverModes];
  if(!(customer.routeEmail || customer.routeSMS || customer.routeChat)){
    deliverModesOption = deliverModesOption.filter(mode => mode.value === 'spoken');
  }
  const group = document.getElementById("deliverModeGroup");
  group.innerHTML = "";

  deliverModesOption.forEach(mode => {
    const wrapper = document.createElement("p");
    wrapper.className = "radio-option";
    wrapper.style.display = "block";
    wrapper.style.cursor = "pointer";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "deliverMode";
    input.value = mode.value;
    input.id = `deliverMode_${mode.value}`;

    const text = document.createTextNode(" " + mode.label);

    wrapper.appendChild(input);
    wrapper.appendChild(text);
    group.appendChild(wrapper);
  });
}

function setTabDetails(selectedTab,src = "/assets/directGuest.png",alt){
    const titleDiv = selectedTab.querySelector(".cxone-tab-title");
    titleDiv.textContent = alt;
    const iconDiv = selectedTab.querySelector(".cxone-tab-icon");
    iconDiv.innerHTML = "";
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.width = 200;
    img.width = '-webkit-fill-available';
    img.height = 200;
    img.style.objectFit = "contain";
    iconDiv.appendChild(img);
}

document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();

  document.getElementById("serviceSelector").addEventListener("change", (e) => {
    setTheme(e.target.value);
  });

  document.getElementById("customerSelector").addEventListener("change", (e) => {
    setCustomer(e.target.value);
  });
});

// SVG icon helpers (returns an inline SVG string)
function svgCheck() {
  return '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function svgCross() {
  return '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
// function svgPhone() {
//   return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.77 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.39 1.98.65 3.03.77A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// }
// function svgEmail() {
//   return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L12 13 2 6" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// }
// function svgSMS() {
//   return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// }
// function svgChat() {
//   return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// }

function setAuthChip(isAuthenticated) {
  if (isAuthenticated) {
    authChip.innerHTML =
      '<span class="icon check" style="color:var(--brand);">' +
      svgCheck() +
      "</span><span><strong>Authenticated</strong></span>";
  } else {
    authChip.innerHTML =
      '<span class="icon cross" style="color:#9ca3af;">' +
      svgCross() +
      "</span><span>Unauthenticated</span>";
  }
}

// Set language flag based on lang code such as en-DE, de-DE, nl-NL
function setPhoneType(phoneType = "Mobile", phoneTypeImage) {
  const phoneTypeDiv = document.getElementById("phoneType");
  if (!phoneTypeDiv) return;
  phoneTypeDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = phoneTypeImage || "/assets/phoneTypes/mobile.png";
  img.alt = `${phoneType} flag`;
  phoneTypeDiv.appendChild(img);
}

// Set language flag based on lang code such as en-DE, de-DE, nl-NL
function setLangFlag(lang = "en-US", langFlag) {
  const flagDiv = document.getElementById("langFlag");
  if (!flagDiv) return;
  flagDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = langFlag || "/assets/flags/english.png";
  img.alt = `${lang} flag`;
  flagDiv.appendChild(img);
}

function applyService(s) {
  const meta = BRANDS[s] || Object.values(BRANDS)[0];
  serviceFooterName.textContent = meta.name;
  document.getElementById("serviceFooterTagline").textContent = meta.tag;
}

function updateNextEnabled() {
  btnNext.disabled = !intentSelector.value;
}

function populateFromIVR(payload) {
  if (!payload) return;
  if (payload.brand) serviceSelector.value = payload.brand;
  console.log('payload: ', payload);
  if (payload.intent) {
    console.log('payload.intent: ', payload.intent);
    intentSelector.value = payload.intent;
    handleIntentChange();
  } else {
    intentSelector.value = '';

  }
  if (payload.booking) {
    bookingNumber.value = payload.booking.id || "";
    bookingDate.value = payload.booking.date || "";
    bookingTab.style.display = "block";
  }
  transcript.value = payload.transcript || "";
  bookingNotes.value = payload.bookingNotes;
}

function handleIntentChange() {
  console.log('handleIntentChange: ');
}

// Events
serviceSelector.addEventListener("change", () => {
  applyService(serviceSelector.value);
});
intentSelector.addEventListener("change", handleIntentChange);

btnCancel.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    console.log("Changes discarded.");
  }
});

btnNext.addEventListener("click", () => {
  if (btnNext.disabled) return;
  const data = {
    brand: serviceSelector.value,
    intent: intentSelector.value,
    booking: { id: bookingNumber.value, date: bookingDate.value },
    bookingNotes: bookingNotes.value,
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
  //   booking: { id: bookingNumber, date: bookingDate },
  //   bookingNotes,
  //   transferTo,
  //   mediaType,
  //   routes,
  //   phoneType: customer.phoneType || null,
  //   lang: customer.lang || null,
  //   authenticated: customer.authenticated || false,
  //   timestamp: new Date().toISOString(),
  // };
  console.log('data:', data);
  localStorage.setItem("cxone-form-draft", JSON.stringify(data));
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


// searchable autocomplete multi-select dropdown start

const input = document.getElementById("termSearch");
const optionsList = document.getElementById("termOptions");
const selectedTagsContainer = document.getElementById("selectedTags");

let selectedTerms = [];

function renderOptions(filter = "") {
  optionsList.innerHTML = "";
  const filtered = customer.termsAndConditions.filter(t => t.label.toLowerCase().includes(filter.toLowerCase()) && !selectedTerms.some(term => term.label === t.label));
  filtered.forEach(term => {
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
  input.value = "";
  renderOptions();
}

function renderTags() {
  selectedTagsContainer.innerHTML = "";
  selectedTerms.forEach(term => {
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
  selectedTerms = selectedTerms.filter(t => t.label !== term.label);
  renderTags();
  renderOptions();
}

input.addEventListener("focus", () => renderOptions());
input.addEventListener("input", e => renderOptions(e.target.value));
document.addEventListener("click", e => {
  if (!e.target.closest("#termSearch")) {
    optionsList.style.display = "none";
    input.value = "";
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
  const filtered = cxOneAgents.filter(a =>
    a.label.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(a => {
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
searchInput.addEventListener("input", e => {
  renderOptions1(e.target.value);
});

// Open options on focus
searchInput.addEventListener("focus", () => renderOptions1(""));

// Close options when clicking outside
document.addEventListener("click", e => {
  if (!e.target.closest("#transferSearch")) {
    optionsContainer.style.display = "none";
  }
});

// searchable autocomplete single-select dropdown start


function populateDropdown(selectId, data) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="" disabled>-- Select --</option>';
  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
}


const mediaButtons = document.querySelectorAll(".media-toggle-group .media-type");
const selectedMedia = new Set();

mediaButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;

    // Toggle active state
    btn.classList.toggle("active");

    // Manage selected values
    if (selectedMedia.has(value)) {
      selectedMedia.delete(value);
    } else {
      selectedMedia.add(value);
    }

    console.log("Selected media:", Array.from(selectedMedia));
  });
});


const subscriptionButtons = document.querySelectorAll(".subscription-toggle-group .subscription-type");
const selectedSubscription = new Set();

subscriptionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;

    // Toggle active state
    btn.classList.toggle("active");

    // Manage selected values
    if (selectedSubscription.has(value)) {
      selectedSubscription.delete(value);
    } else {
      selectedSubscription.add(value);
    }

    console.log("Selected media:", Array.from(selectedSubscription));
  });
});