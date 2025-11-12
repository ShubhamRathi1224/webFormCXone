import { SAMPLE_API_RESPONSE, BRANDS, SAMPLE_API_RESPONSES } from "./data.js";

// Elements
const serviceSelector = document.getElementById("serviceSelector");
const authChip = document.getElementById("authChip");
const customerInfoTab = document.getElementById("customerInfoTab");
const travelAdvisorTab = document.getElementById("travelAdvisorTab");
const intentTab = document.getElementById("intentTab");
const intent = document.getElementById("intent");
const bookingTab = document.getElementById("bookingTab");
const bookingNumber = document.getElementById("bookingNumber");
const bookingDate = document.getElementById("bookingDate");
const notes = document.getElementById("notes");
const transcript = document.getElementById("transcript");
const btnNext = document.getElementById("btnNext");
const btnCancel = document.getElementById("btnCancel");
const serviceFooterName = document.getElementById("serviceFooterName");

// --- ENV and Sample API Response ---
let ENV_API_URL = "";
// Load environment file when served over http/https; skip when opened via file:// to avoid CORS issues
if (location.protocol === "http:" || location.protocol === "https:") {
  fetch("cxone.env")
    .then((r) => r.text())
    .then((txt) => {
      const match = txt.match(/^API_URL=(.*)$/m);
      if (match) ENV_API_URL = match[1].trim();
    })
    .catch((err) => {
      // ignore missing env file or network errors
      console.warn("Could not load cxone.env:", err);
    });
} else {
  // running from file:// – skip loading env to avoid CORS errors
  console.info("Skipping cxone.env fetch when running from file://");
}

(function init() {
  document.getElementById("copyrightYear").textContent =
    new Date().getFullYear();

  setCustomer();

  // const urlParams = new URLSearchParams(window.location.search);
  // const bookingIdParam = urlParams.get("bookingNumber");
  // if (bookingIdParam && customerIdParam) {
  //   bookingNumber.value = bookingIdParam;
  //   fetchFromApi({
  //     bookingNumber: bookingIdParam,
  //   }).then((data) => {
  //     console.log("data: ", data);
  //     setCustomer();
  //   });
  // }
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
  console.log('saved: ', saved);
  setTheme(saved);
}

function setCustomer(customerId = "C-0001") {
  const customer = SAMPLE_API_RESPONSES.find((c => c.customerId === customerId));
  console.log("customer: ", customer);
  if(customer.callerType=="D"){
    customerInfoTab.style.display="block";
    travelAdvisorTab.style.display="none";
    setTabDetails(customerInfoTab, "/assets/directGuest.png", "Direct Guest");
  } else {
    travelAdvisorTab.style.display="block";
    customerInfoTab.style.display="none";
    setTabDetails(travelAdvisorTab, customer.travelAdvisorImage, customer.travelAdvisor);
  }
  if(customer.intent){
    setTabDetails(intentTab, customer.intentImage, customer.intent);
  }
  if(customer.booking){
    setTabDetails(bookingTab, customer.voyageTypeImage, customer.voyageType);
  }

  setTheme(customer.brand);
  setAuthChip(customer.authenticated);
  populateFromIVR(customer);
  if (customer.lang) setLangFlag(customer.lang, customer.langFlag);
  setPhoneType(customer.phoneType, customer.phoneTypeImage);
  updateNextEnabled();
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
  console.log("meta: ", meta);
  serviceFooterName.textContent = meta.name;
  document.getElementById("serviceFooterTagline").textContent = meta.tag;
}

function updateNextEnabled() {
  btnNext.disabled = !intent.value;
}

function populateFromIVR(payload) {
  if (!payload) return;
  if (payload.brand) serviceSelector.value = payload.brand;
  if (payload.intent) {
    intent.value = payload.intent;
    handleIntentChange();
  }
  if (payload.booking) {
    bookingNumber.value = payload.booking.id || "";
    bookingDate.value = payload.booking.date || "";
    bookingTab.style.display = "block";
  }
  transcript.value = payload.transcript || "";
  if (payload.notes) notes.value = payload.notes;
}

function handleIntentChange() {
  console.log('handleIntentChange: ');
}

// Events
serviceSelector.addEventListener("change", () => {
  console.log("serviceSelector: ");
  applyService(serviceSelector.value);
});
intent.addEventListener("change", handleIntentChange);

btnCancel.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    console.log("Changes discarded.");
  }
});

btnNext.addEventListener("click", () => {
  if (btnNext.disabled) return;
  const data = {
    brand: serviceSelector.value,
    intent: intent.value,
    booking: { id: bookingNumber.value, date: bookingDate.value },
    notes: notes.value,
    routes: {
      email: document.getElementById("routeEmail").checked,
      phone: document.getElementById("routePhone").checked,
      sms: document.getElementById("routeSMS").checked,
      chat: document.getElementById("routeChat").checked,
    },
    transferTo: document.getElementById("transferTo").value,
    timestamp: new Date().toISOString(),
  };
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






// // Build API URL by appending known params if base is provided
// function buildApiUrl(base, params) {
//   if (!base) return null;
//   try {
//     const url = new URL(base, location.href);
//     Object.keys(params).forEach((k) => {
//       if (params[k]) url.searchParams.set(k, params[k]);
//     });
//     return url.toString();
//   } catch (e) {
//     // base might be a raw string - try simple concatenation
//     const qs = Object.keys(params)
//       .filter((k) => params[k])
//       .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
//       .join("&");
//     return base + (base.includes("?") ? "&" : "?") + qs;
//   }
// }

// async function fetchFromApi(params) {
//   console.log("ENV_API_URL: ", ENV_API_URL);
//   try {
//     if (ENV_API_URL) {
//       const url = buildApiUrl(ENV_API_URL, params);
//       const resp = await fetch(url, { method: "GET", credentials: "omit" });
//       if (!resp.ok) throw new Error("HTTP " + resp.status);
//       const data = await resp.json();
//       return data;
//     } else {
//       return SAMPLE_API_RESPONSE;
//     }
//   } catch (err) {
//     return null;
//   }
// }