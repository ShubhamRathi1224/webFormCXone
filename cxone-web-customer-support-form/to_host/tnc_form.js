// Example: Deliver mode options
const deliverModes = [
  { value: "spoken", label: "Spoken", isTextIncluded: false },
  { value: "text", label: "Text", isTextIncluded: true },
  { value: "both", label: "Both Spoken and Text", isTextIncluded: true },
];

const CUSTOMER = {
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
  customer = CUSTOMER;
  populateTnCDeliverModes(customer);
})();

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

// searchable autocomplete multi-select tnc dropdown start

const termSearchInput = document.getElementById("termSearch");
const termOptionsList = document.getElementById("termOptions");
const selectedTnCTagsDiv = document.getElementById("selectedTnCTags");

let selectedTerms = [];

function renderOptions(filter = "") {
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
  renderOptions();
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
  renderOptions();
}

termSearchInput.addEventListener("focus", () => renderOptions());
termSearchInput.addEventListener("input", (e) => renderOptions(e.target.value));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#termSearch")) {
    termOptionsList.style.display = "none";
    termSearchInput.value = "";
  }
});

// searchable autocomplete multi-select tnc dropdown end