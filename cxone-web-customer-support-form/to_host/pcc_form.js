const cxOneAgents = [
  { value: "agent1", label: "Agent 1" },
  { value: "agent2", label: "Agent 2" },
  { value: "agent3", label: "Agent 3" },
  { value: "agent4", label: "Agent 4" },
  { value: "agent5", label: "Agent 5" },
];

// Elements
const copyrightYear = document.getElementById("copyrightYear");

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
  populateTransferModes();
})();

function populateTransferModes() {
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
  const selected = e.target.value; // email or chat
  const targetEl = document.getElementById("pccNameField");

  if (selected === "skillSet") {
    targetEl.style.display = "none";      // hide on "email"
  } else {
    targetEl.style.display = "block";     // show on "chat"
  }
}

// searchable autocomplete single-select pcc dropdown start

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

// searchable autocomplete single-select pcc dropdown start