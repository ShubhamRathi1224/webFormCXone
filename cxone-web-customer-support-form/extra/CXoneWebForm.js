function setTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  localStorage.setItem("theme", name);
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
function svgWarn() {
  return '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="0" fill="currentColor"/><path d="M12 9v4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function svgPhone() {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.77 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.39 1.98.65 3.03.77A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function svgEmail() {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L12 13 2 6" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function svgSMS() {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function svgChat() {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function setAuthChip(status) {
  // status: 'authenticated' | 'partial' | 'unauthenticated'
  if (!document.getElementById("authChip")) return;
  if (status === "authenticated") {
    document.getElementById("authChip").innerHTML =
      '<span class="icon check" style="color:var(--brand);">' +
      svgCheck() +
      "</span><span><strong>Authenticated</strong></span>";
  } else if (status === "partial") {
    document.getElementById("authChip").innerHTML =
      '<span class="icon warn" style="color:#d97706;">' +
      svgWarn() +
      "</span><span>Partially Authenticated</span>";
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

const SAMPLE_API_RESPONSE = {
  brand: "cunard",
  phone: "+15551234567",
  email: "sample@email.com",
  customerId: "C-0001",
  callerName: "John Doe",
  ccn: "CCN-12345",
  callerType: "Guest",
  travelAdvisor: "Jane Smith",
  intent: "billing",
  rating: "5",
  satisfied: "yes",
  booking: { id: "B-123", date: "2025-11-05 09:30" },
  notes: "Sample notes for the agent.",
  mediaType: "call",
  authenticated: true,
  lang: "en-US",
  transcript: "Sample IVR transcript",
  transferTo: "Support Queue",
  routeEmail: true,
  routePhone: true,
  routeSMS: false,
  routeChat: true,
  acceptTerms: true,
};

async function fetchFromApi(params) {
  console.log("ENV_API_URL: ", ENV_API_URL);
  try {
    if (ENV_API_URL) {
      const url = buildApiUrl(ENV_API_URL, params);
      const resp = await fetch(url, { method: "GET", credentials: "omit" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      const mapped = {
        brand: data.brand || params.brand || serviceSelector.value,
        phone:
          data.phone || data.contact?.phone || data.mobile || data.msisdn || "",
        email: data.email || data.contact?.email || "",
        customerId:
          data.customerId ||
          data.customer_id ||
          data.ccn ||
          params.customerId ||
          "",
        callerName: data.callerName || data.name || "",
        ccn: data.ccn || data.ccnNumber || "",
        callerType: data.callerType || data.caller_type || "",
        travelAdvisor: data.travelAdvisor || data.advisor || "",
        intent: data.intent || data.callerIntent || "",
        rating: data.rating || data.urgency || "",
        satisfied: data.satisfied || data.isSatisfied || "",
        booking: {
          id: data.booking?.id || data.bookingId || params.bookingId || "",
          date: data.booking?.date || data.bookingDate || "",
        },
        notes: data.notes || data.transferNotes || data.callerTranscript || "",
        mediaType: data.mediaType || data.media || "",
        authenticated: data.authenticated || data.auth || "",
        lang: data.lang || data.language || "",
        transcript: data.transcript || "",
        transferTo: data.transferTo || "",
        routeEmail: data.routeEmail || false,
        routePhone: data.routePhone || false,
        routeSMS: data.routeSMS || false,
        routeChat: data.routeChat || false,
        acceptTerms: data.acceptTerms || false,
      };
      applyService(serviceSelector.value);
      populateFromIVR(mapped);
      return data;
    } else {
      const data = SAMPLE_API_RESPONSE;
      const mapped = {
        brand: data.brand || params.brand || serviceSelector.value,
        phone: data.phone || "",
        email: data.email || "",
        customerId: data.customerId || "",
        callerName: data.callerName || "",
        ccn: data.ccn || "",
        callerType: data.callerType || "",
        travelAdvisor: data.travelAdvisor || "",
        intent: data.intent || "",
        rating: data.rating || "",
        satisfied: data.satisfied || "",
        booking: { id: data.booking?.id || "", date: data.booking?.date || "" },
        notes: data.notes || "",
        mediaType: data.mediaType || "",
        authenticated: data.authenticated || "",
        lang: data.lang || "",
        transcript: data.transcript || "",
        transferTo: data.transferTo || "",
        routeEmail: data.routeEmail || false,
        routePhone: data.routePhone || false,
        routeSMS: data.routeSMS || false,
        routeChat: data.routeChat || false,
        acceptTerms: data.acceptTerms || false,
      };
      applyService(serviceSelector.value);
      populateFromIVR(mapped);
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
const btnCheckAuth = document.getElementById("btnCheckAuth");
const acceptTerms = document.getElementById("acceptTerms");
const btnNext = document.getElementById("btnNext");
const btnSave = document.getElementById("btnSave");
const btnCancel = document.getElementById("btnCancel");
const serviceFooterName = document.getElementById("serviceFooterName");

// Cruise brand metadata
const SERVICES = {
  holland: {
    name: "Holland America Line",
    tag: "Taking you to extraordinary places",
    theme: "holland",
    short: "HAL",
  },
  princess: {
    name: "Princess Cruises",
    tag: "Come back new",
    theme: "princess",
    short: "PCL",
  },
  seabourn: {
    name: "Seabourn",
    tag: "Elegant, ultra-luxury cruises",
    theme: "seabourn",
    short: "SBN",
  },
  cunard: {
    name: "Cunard",
    tag: "Leaders in luxury ocean travel",
    theme: "cunard",
    short: "CUN",
  },
};

// Set language flag based on lang code such as en-DE, de-DE, nl-NL
function setLangFlag(lang) {
  const el = document.getElementById("langFlag");
  if (!el) return;
  if (!lang) {
    el.textContent = "";
    return;
  }
  const parts = (lang || "").split("-");
  const country = (parts[1] || "").toUpperCase();
  const map = { DE: "🇩🇪", NL: "🇳🇱", US: "🇺🇸", GB: "🇬🇧" };
  const flag = map[country] || "";
  el.textContent = flag + (flag ? " " + lang : lang);
}

function applyService(s) {
  const meta = SERVICES[s] || Object.values(SERVICES)[0];
  console.log("meta: ", meta);
  serviceFooterName.textContent = meta.name;
  document.getElementById("serviceFooterTagline").textContent = meta.tag;
}

function checkAuth() {
  let registered = !!customerId.value.trim();
  regChip.textContent = registered ? "Yes" : "No";
  if (registered) {
    setAuthChip("authenticated");
  } else if (phone.value.trim() || email.value.trim()) {
    setAuthChip("partial");
  } else {
    setAuthChip("unauthenticated");
  }
  updateNextEnabled();
}

function updateNextEnabled() {
  btnNext.disabled = !(acceptTerms.checked && !!intent.value);
}

function populateFromIVR(payload) {
  console.log("payload: ", payload);
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
  checkAuth();
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
btnCheckAuth.addEventListener("click", checkAuth);

btnSave.addEventListener("click", async () => {
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

btnCancel.addEventListener("click", () => {
  if (confirm("Discard changes?")) {
    // reload last saved or clear
    const saved = localStorage.getItem("cxone-form-draft");
    if (saved) {
      const obj = JSON.parse(saved);
      populateFromIVR(obj);
    } else {
      phone.value = email.value = customerId.value = "";
      intent.value = "";
      bookingId.value = bookingDate.value = "";
      notes.value = "";
      acceptTerms.checked = false;
      checkAuth();
    }
  }
});

btnNext.addEventListener("click", () => {
  if (btnNext.disabled) return;
  const payload = {
    service: serviceSelector.value,
    phone: phone.value,
    email: email.value,
    customerId: customerId.value,
    intent: intent.value,
    booking: { id: bookingId.value, date: bookingDate.value },
    notes: notes.value,
  };
  alert(
    "Proceeding to next step with payload:\n" + JSON.stringify(payload, null, 2)
  );
});

(function init() {
  document.getElementById("copyrightYear").textContent =
    new Date().getFullYear();
  applyService(serviceSelector.value);

  const params = getQueryParams();
  console.log("params: ", params);
  const bookingIdParam = params.bookingId;
  const customerIdParam =
    params.customerId ||
    params.customer_id ||
    params.customer ||
    params.ccn ||
    "";
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
      if (params.lang) setLangFlag(params.lang);
    });
    checkAuth();
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
    checkAuth();
  }
})();
