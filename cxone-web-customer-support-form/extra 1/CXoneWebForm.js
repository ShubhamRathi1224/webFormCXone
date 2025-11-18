function setTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  localStorage.setItem("theme", name);
  
  const service = SERVICES[name] || Object.values(SERVICES)[0];
  const url = service.favicon; 
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

function loadSavedTheme() {
  const saved = localStorage.getItem("theme") || "holland";
  setTheme(saved);
  document.getElementById("serviceSelector").value = saved;
}

document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();

  document.getElementById("serviceSelector").addEventListener("change", (e) => {
    setTheme(e.target.value);
  });

  // Make panels collapsible: wrap panel contents (after H3) into .panel-body and add a small toggle
  document.querySelectorAll(".panel").forEach((panel) => {
    if (panel.querySelector(".panel-body")) return; // already processed
    // find first heading (h3)
    const header = Array.from(panel.children).find(
      (n) => n.tagName && n.tagName.toLowerCase() === "h3"
    );
    const body = document.createElement("div");
    body.className = "panel-body";
    if (header) {
      // move all following sibling nodes into body
      let node = header.nextSibling;
      const toMove = [];
      while (node) {
        toMove.push(node);
        node = node.nextSibling;
      }
      toMove.forEach((n) => body.appendChild(n));
      // append collapse toggle to header
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "panel-toggle";
      btn.setAttribute("aria-expanded", "true");
      btn.innerHTML = "▾";
      btn.addEventListener("click", () => {
        panel.classList.toggle("collapsed");
        const expanded = !panel.classList.contains("collapsed");
        btn.setAttribute("aria-expanded", expanded);
        btn.innerHTML = expanded ? "▾" : "▸";
      });
      header.appendChild(btn);
      panel.appendChild(body);
    }
  });
});

// ----------------*************************------------------

// CXoneWebForm.js
// Extracted from CXoneWebForm.html

// Utility: safe JSON parse
function tryParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

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
    document.getElementById("authChip").innerHTML =
      '<span class="icon check" style="color:var(--brand);">' +
      svgCheck() +
      "</span><span><strong>Authenticated</strong></span>";
  } else {
    document.getElementById("authChip").innerHTML =
      '<span class="icon cross" style="color:#9ca3af;">' +
      svgCross() +
      "</span><span>Unauthenticated</span>";
  }
}

// Read query params into an object
function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");
  const customerId = urlParams.get("customerId");
  console.log("urlParams: ", urlParams);
  console.log("bookingId: ", bookingId);
  console.log("customerId: ", customerId);

  const qs = location.search.replace(/^\?/, "");
  if (!qs) return {};
  return qs.split("&").reduce((acc, pair) => {
    const [k, v] = pair.split("=");
    if (!k) return acc;
    try {
      acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
    } catch (e) {
      acc[k] = v || "";
    }
    return acc;
  }, {});
}

// Build API URL by appending known params if base is provided
function buildApiUrl(base, params) {
  if (!base) return null;
  try {
    const url = new URL(base, location.href);
    Object.keys(params).forEach((k) => {
      if (params[k]) url.searchParams.set(k, params[k]);
    });
    return url.toString();
  } catch (e) {
    // base might be a raw string - try simple concatenation
    const qs = Object.keys(params)
      .filter((k) => params[k])
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    return base + (base.includes("?") ? "&" : "?") + qs;
  }
}

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

const SAMPLE_API_RESPONSES = [
  {
    brand: "cunard",
    logo: "/assets/logos/cunard.png",
    phone: "+15551234567",
    email: "sample@email.com",
    customerId: "C-0001",
    callerName: "John Doe",
    ccn: "CCN-12345",
    callerType: "D",
    callerTypeLogo: "/assets/icons/guest.png",
    travelAdvisor: "Jane Smith",
    intent: "billing",
    intentImage: "/assets/intents/billing.png",
    rating: "5",
    satisfied: "yes",
    booking: { id: "B-123", date: "2025-11-05 09:30" },
    notes: "Sample notes for the agent.",
    mediaType: "Voice",
    authenticated: true,
    lang: "en-US",
    langFlag: "/assets/flags/english.png",
    transcript: "Sample IVR transcript",
    transferTo: "Support Queue",
    routeEmail: true,
    routePhone: true,
    routeSMS: false,
    routeChat: true,
    acceptTerms: true,
  },
  {
    brand: "holland",
    logo: "/assets/logos/holland.png",
    phone: "+493012345678",
    email: "lucas.müller@sample.com",
    customerId: "C-0002",
    callerName: "Lucas Müller",
    ccn: "CCN-23456",
    callerType: "T",
    callerTypeLogo: "/assets/icons/travel-advisor.png",
    travelAdvisor: "Emily Clark",
    intent: "modify booking",
    intentImage: "/assets/intents/booking.png",
    rating: "4",
    satisfied: "yes",
    booking: { id: "B-234", date: "2025-11-06 14:00" },
    notes: "Requested to modify the existing booking.",
    mediaType: "Chat",
    authenticated: false,
    lang: "de-DE",
    langFlag: "/assets/flags/german.png",
    transcript: "Kunde möchte die Buchung ändern.",
    transferTo: "Reservations Queue",
    routeEmail: false,
    routePhone: true,
    routeSMS: true,
    routeChat: true,
    acceptTerms: false,
  },
  {
    brand: "seabourn",
    logo: "/assets/logos/seabourn.png",
    phone: "+31612345678",
    email: "emma.dejong@sample.nl",
    customerId: "C-0003",
    callerName: "Emma de Jong",
    ccn: "CCN-34567",
    callerType: "D",
    callerTypeLogo: "/assets/icons/guest.png",
    travelAdvisor: "Oliver Schmidt",
    intent: "modify beds",
    intentImage: "/assets/intents/beds.png",
    rating: "5",
    satisfied: "yes",
    booking: { id: "B-345", date: "2025-11-07 10:15" },
    notes: "Customer wants to modify bed arrangement.",
    mediaType: "Voice",
    authenticated: true,
    lang: "nl-NL",
    langFlag: "/assets/flags/dutch.png",
    transcript: "Wil graag de beddenconfiguratie aanpassen.",
    transferTo: "Guest Services",
    routeEmail: true,
    routePhone: true,
    routeSMS: false,
    routeChat: true,
    acceptTerms: true,
  },
  {
    brand: "princess",
    logo: "/assets/logos/princess.png",
    phone: "+442012345678",
    email: "sophie.brown@sample.co.uk",
    customerId: "C-0004",
    callerName: "Sophie Brown",
    ccn: "CCN-45678",
    callerType: "T",
    callerTypeLogo: "/assets/icons/travel-advisor.png",
    travelAdvisor: "Daniel White",
    intent: "refund request",
    intentImage: "/assets/intents/refund.png",
    rating: "3",
    satisfied: "no",
    booking: { id: "B-456", date: "2025-11-08 16:00" },
    notes: "Customer requesting refund for canceled trip.",
    mediaType: "Email",
    authenticated: false,
    lang: "en-DE",
    langFlag: "/assets/flags/english.png",
    transcript: "Refund requested via email.",
    transferTo: "Billing Department",
    routeEmail: true,
    routePhone: false,
    routeSMS: false,
    routeChat: false,
    acceptTerms: true,
  },
  {
    brand: "holland",
    logo: "/assets/logos/holland.png",
    phone: "+15557654321",
    email: "jason.williams@sample.com",
    customerId: "C-0005",
    callerName: "Jason Williams",
    ccn: "CCN-56789",
    callerType: "D",
    callerTypeLogo: "/assets/icons/guest.png",
    travelAdvisor: "N/A",
    intent: "cabin upgrade",
    intentImage: "/assets/intents/cabin.png",
    rating: "5",
    satisfied: "yes",
    booking: { id: "B-567", date: "2025-11-09 11:45" },
    notes: "Interested in upgrading to premium suite.",
    mediaType: "Voice",
    authenticated: true,
    lang: "en-US",
    langFlag: "/assets/flags/german.png",
    transcript: "Customer wants to upgrade cabin.",
    transferTo: "Sales Queue",
    routeEmail: true,
    routePhone: true,
    routeSMS: true,
    routeChat: true,
    acceptTerms: true,
  },
  {
    brand: "seabourn",
    logo: "/assets/logos/seabourn.png",
    phone: "+31201234567",
    email: "mark.visser@sample.nl",
    customerId: "C-0006",
    callerName: "Mark Visser",
    ccn: "CCN-67890",
    callerType: "T",
    callerTypeLogo: "/assets/icons/travel-advisor.png",
    travelAdvisor: "Lisa Turner",
    intent: "itinerary change",
    intentImage: "/assets/intents/itinerary.png",
    rating: "4",
    satisfied: "yes",
    booking: { id: "B-678", date: "2025-11-10 08:00" },
    notes: "Requested itinerary changes for cruise trip.",
    mediaType: "Voice",
    authenticated: true,
    lang: "en-NL",
    langFlag: "/assets/flags/dutch.png",
    transcript: "Discussed new itinerary changes.",
    transferTo: "Operations Queue",
    routeEmail: true,
    routePhone: true,
    routeSMS: false,
    routeChat: false,
    acceptTerms: true,
  },
  {
    brand: "princess",
    logo: "/assets/logos/princess.png",
    phone: "+14151234567",
    email: "olivia.martinez@sample.com",
    customerId: "C-0007",
    callerName: "Olivia Martinez",
    ccn: "CCN-78901",
    callerType: "D",
    callerTypeLogo: "/assets/icons/guest.png",
    travelAdvisor: "N/A",
    intent: "lost luggage",
    intentImage: "/assets/intents/luggage.png",
    rating: "2",
    satisfied: "no",
    booking: { id: "B-789", date: "2025-11-11 12:30" },
    notes: "Reported missing luggage after arrival.",
    mediaType: "Voice",
    authenticated: false,
    lang: "en-US",
    langFlag: "/assets/flags/english.png",
    transcript: "Caller reported lost baggage.",
    transferTo: "Claims Department",
    routeEmail: true,
    routePhone: true,
    routeSMS: false,
    routeChat: false,
    acceptTerms: false,
  },
  {
    brand: "holland",
    logo: "/assets/logos/holland.png",
    phone: "+498912345678",
    email: "katrin.schmidt@sample.de",
    customerId: "C-0008",
    callerName: "Katrin Schmidt",
    ccn: "CCN-89012",
    callerType: "T",
    callerTypeLogo: "/assets/icons/travel-advisor.png",
    travelAdvisor: "David Brown",
    intent: "payment issue",
    intentImage: "/assets/intents/payment.png",
    rating: "4",
    satisfied: "yes",
    booking: { id: "B-890", date: "2025-11-12 09:45" },
    notes: "Reported issue with credit card payment.",
    mediaType: "Chat",
    authenticated: true,
    lang: "de-DE",
    langFlag: "/assets/flags/german.png",
    transcript: "Problem mit der Zahlung.",
    transferTo: "Billing Support",
    routeEmail: false,
    routePhone: true,
    routeSMS: true,
    routeChat: true,
    acceptTerms: true,
  },
  {
    brand: "cunard",
    logo: "/assets/logos/cunard.png",
    phone: "+15553456789",
    email: "will.johnson@sample.com",
    customerId: "C-0009",
    callerName: "William Johnson",
    ccn: "CCN-90123",
    callerType: "D",
    callerTypeLogo: "/assets/icons/guest.png",
    travelAdvisor: "N/A",
    intent: "special assistance",
    intentImage: "/assets/intents/assistance.png",
    rating: "5",
    satisfied: "yes",
    booking: { id: "B-901", date: "2025-11-13 15:00" },
    notes: "Requested wheelchair assistance for boarding.",
    mediaType: "Voice",
    authenticated: true,
    lang: "en-US",
    langFlag: "/assets/flags/dutch.png",
    transcript: "Requires assistance during boarding.",
    transferTo: "Accessibility Desk",
    routeEmail: true,
    routePhone: true,
    routeSMS: false,
    routeChat: false,
    acceptTerms: true,
  },
  {
    brand: "princess",
    logo: "/assets/logos/princess.png",
    phone: "+15552345678",
    email: "sarah.jones@sample.com",
    customerId: "C-0010",
    callerName: "Sarah Jones",
    ccn: "CCN-01234",
    callerType: "T",
    callerTypeLogo: "/assets/icons/travel-advisor.png",
    travelAdvisor: "Tom Williams",
    intent: "cabin availability",
    intentImage: "/assets/intents/cabin.png",
    rating: "5",
    satisfied: "yes",
    booking: { id: "B-012", date: "2025-11-14 18:00" },
    notes: "Checking cabin availability for next month.",
    mediaType: "Voice",
    authenticated: true,
    lang: "en-DE",
    langFlag: "/assets/flags/english.png",
    transcript: "Agent confirmed cabin availability details.",
    transferTo: "Sales Queue",
    routeEmail: true,
    routePhone: true,
    routeSMS: false,
    routeChat: true,
    acceptTerms: true,
  }
];


async function fetchFromApi(params) {
  console.log("ENV_API_URL: ", ENV_API_URL);
  try {
    if (ENV_API_URL) {
      const url = buildApiUrl(ENV_API_URL, params);
      const resp = await fetch(url, { method: "GET", credentials: "omit" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      return data;
    } else {
      const data = SAMPLE_API_RESPONSES[0];
      return data;
    }
  } catch (err) {
    return null;
  }
}

// Elements
const serviceSelector = document.getElementById("serviceSelector");
const authChip = document.getElementById("authChip");
const regChip = document.getElementById("registeredVal");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const customerId = document.getElementById("customerId");
const intent = document.getElementById("intent");
const bookingSection = document.getElementById("bookingSection");
const bookingId = document.getElementById("bookingId");
const bookingDate = document.getElementById("bookingDate");
const notes = document.getElementById("notes");
const acceptTerms = document.getElementById("acceptTerms");
const btnNext = document.getElementById("btnNext");
const btnCancel = document.getElementById("btnCancel");
const serviceFooterName = document.getElementById("serviceFooterName");

// Cruise brand metadata
const SERVICES = {
  holland: {
    name: "Holland America Line",
    tag: "Taking you to extraordinary places",
    theme: "holland",
    short: "HAL",
    favicon: "assets/favicons/holland.png",
  },
  princess: {
    name: "Princess Cruises",
    tag: "Come back new",
    theme: "princess",
    short: "PCL",
    favicon: "assets/favicons/princess.png",
  },
  seabourn: {
    name: "Seabourn",
    tag: "Elegant, ultra-luxury cruises",
    theme: "seabourn",
    short: "SBN",
    favicon: "assets/favicons/seabourn.png",
  },
  cunard: {
    name: "Cunard",
    tag: "Leaders in luxury ocean travel",
    theme: "cunard",
    short: "CUN",
    favicon: "assets/favicons/cunard.png",
  },
};

// Set language flag based on lang code such as en-DE, de-DE, nl-NL
function setLangFlag(lang, langFlag) {
    const flagDiv = document.getElementById("langFlag");
    const img = document.createElement("img");
    img.src = langFlag || "/assets/flags/english.png";
    img.alt = `${lang} flag`;
    flagDiv.appendChild(img);
}

function applyService(s) {
  const meta = SERVICES[s] || Object.values(SERVICES)[0];
  console.log("meta: ", meta);
  serviceFooterName.textContent = meta.name;
  document.getElementById("serviceFooterTagline").textContent = meta.tag;
}

function updateNextEnabled() {
  btnNext.disabled = !(acceptTerms.checked && !!intent.value);
}

function populateFromIVR(payload) {
  if (!payload) return;
  if (payload.service) serviceSelector.value = payload.service;
  if (payload.phone) phone.value = payload.phone;
  if (payload.email) email.value = payload.email;
  if (payload.customerId) customerId.value = payload.customerId;
  if (payload.intent) {
    intent.value = payload.intent;
    handleIntentChange();
  }
  if (payload.booking) {
    bookingId.value = payload.booking.id || "";
    bookingDate.value = payload.booking.date || "";
    bookingSection.style.display = "block";
  }
  if (payload.notes) notes.value = payload.notes;
}

function handleIntentChange() {
  if (intent.value === "booking") bookingSection.style.display = "block";
  else bookingSection.style.display = "none";
  updateNextEnabled();
}

// Events
serviceSelector.addEventListener("change", () => {
  applyService(serviceSelector.value);
});
intent.addEventListener("change", handleIntentChange);
acceptTerms.addEventListener("change", updateNextEnabled);

btnCancel.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    console.log('Changes discarded.');
  }
});

btnNext.addEventListener("click", () => {
  if (btnNext.disabled) return;
  const data = {
    service: serviceSelector.value,
    phone: phone.value,
    email: email.value,
    customerId: customerId.value,
    intent: intent.value,
    booking: { id: bookingId.value, date: bookingDate.value },
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

(function init() {
  document.getElementById("copyrightYear").textContent =
    new Date().getFullYear();
  applyService(serviceSelector.value);

  const params = getQueryParams();
  console.log("params: ", params);
  const bookingIdParam = params.bookingId || "";;
  const customerIdParam =  params.customerId || "";
  const serviceParam = params.service || "";

  if (bookingIdParam && customerIdParam) {
    bookingId.value = bookingIdParam;
    customerId.value = customerIdParam;
    if (serviceParam) serviceSelector.value = serviceParam;
    fetchFromApi({
      bookingNumber: bookingIdParam,
      customerId: customerIdParam,
      service: serviceParam,
    }).then((data) => {
      console.log('data: ', data);
      setAuthChip(data.authenticated);
      populateFromIVR(data);
      if (data.lang) setLangFlag(data.lang, data.langFlag);
      updateNextEnabled();
    });
  } else {
    bookingId.value = "";
    customerId.value = "";
    phone.value = "";
    email.value = "";
    document.getElementById("callerName").value = "";
    document.getElementById("ccn").value = "";
    intent.value = "";
    document.getElementById("rating").value = "";
    document.getElementById("satisfiedYes").checked = false;
    document.getElementById("satisfiedNo").checked = false;
    document.getElementById("transcript").value = "";
    bookingDate.value = "";
    notes.value = "";
    document.getElementById("transferTo").value = "";
    document.getElementById("routeEmail").checked = false;
    document.getElementById("routePhone").checked = false;
    document.getElementById("routeSMS").checked = false;
    document.getElementById("routeChat").checked = false;
    acceptTerms.checked = false;
    setAuthChip(false);
  }

})();
