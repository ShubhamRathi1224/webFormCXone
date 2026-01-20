let pccList = [];

const skillList = [
  { value: "skill1", label: "Skill 1" },
  { value: "skill2", label: "Skill 2" },
  { value: "skill3", label: "Skill 3" },
  { value: "skill4", label: "Skill 4" },
  { value: "skill5", label: "Skill 5" },
];

const pccTransferField = document.getElementById("pccTransferField");
const skillTransferField = document.getElementById("skillTransferField");

const pccTransferSearchInput = document.getElementById("pccTransferSearch");
const pccTransferOptionsDiv = document.getElementById("pccTransferOptions");
const pccTransferInput = document.getElementById("pccTransfer");

const skillTransferSearchInput = document.getElementById("skillTransferSearch");
const skillTransferOptionsDiv = document.getElementById("skillTransferOptions");
const skillTransferInput = document.getElementById("skillTransfer");

(function init() {
  loadPCCList()
  populateTransferModes();
})();

async function loadPCCList() {
  const url = "./pcc-list/HAL_nl-NL.csv";
  try {
    const res = await fetch(url);
    const csvText = await res.text();
    pccList = csvToJson(csvText);
  } catch (error) {
    document.getElementById("pccTransferError").textContent = "Failed to load PCC list.";
    console.error("Error fetching JSON:", error);
  }
}

function csvToJson(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}

function populateTransferModes() {
  var deliverModesOption = [ 
    { value: "consultant", label: "PCC" },
    { value: "skillSet", label: "Skill Set" },
  ];
  const group = document.getElementById("transferModeGroup");
  group.innerHTML = "";

  deliverModesOption.forEach((mode,index) => {
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

    if (index === 0) {
      input.checked = true;
      skillTransferField.style.display = "none";
    }

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
    skillTransferField.style.display = "block";
    pccTransferField.style.display = "none";
    pccTransferSearchInput.value = null;
    pccTransferInput.value = null;
  } else {
    pccTransferField.style.display = "block";
    skillTransferField.style.display = "none";
    skillTransferSearchInput.value = null;
    skillTransferInput.value = null;
  }
}

// searchable autocomplete single-select pcc transfer dropdown start

function renderPCCTransferOptions(filter = "") {
  pccTransferOptionsDiv.innerHTML = "";
  const filtered = pccList.filter((a) =>
    a["First Name"].toLowerCase().includes(filter.toLowerCase()) || a["Last Name"].toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach((a) => {
    const div = document.createElement("div");
    div.className = "option-item";
    div.textContent = a["First Name"] + " " + a["Last Name"];
    div.dataset.value = a["Agent ID"];
    div.addEventListener("click", () => selectPCCTransferOption(a));
    pccTransferOptionsDiv.appendChild(div);
  });
  pccTransferOptionsDiv.style.display = filtered.length ? "block" : "none";
}

function selectPCCTransferOption(agent) {
  pccTransferSearchInput.value = agent["First Name"] + " " + agent["Last Name"];
  pccTransferInput.value = agent["Agent ID"];
  pccTransferOptionsDiv.style.display = "none";
}

pccTransferSearchInput.addEventListener("input", (e) => {
  renderPCCTransferOptions(e.target.value);
});

pccTransferSearchInput.addEventListener("focus", () => renderPCCTransferOptions(""));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#pccTransferSearch")) {
    pccTransferOptionsDiv.style.display = "none";
  }
});

// searchable autocomplete single-select pcc transfer dropdown start


// searchable autocomplete single-select skill transfer dropdown start

function renderSkillTransferOptions(filter = "") {
  skillTransferOptionsDiv.innerHTML = "";
  const filtered = skillList.filter((a) =>
    a.label.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach((a) => {
    const div = document.createElement("div");
    div.className = "option-item";
    div.textContent = a.label;
    div.dataset.value = a.value;
    div.addEventListener("click", () => selectSkillTransferOption(a));
    skillTransferOptionsDiv.appendChild(div);
  });
  skillTransferOptionsDiv.style.display = filtered.length ? "block" : "none";
}

function selectSkillTransferOption(agent) {
  skillTransferSearchInput.value = agent.label;
  skillTransferInput.value = agent.value;
  skillTransferOptionsDiv.style.display = "none";
}

skillTransferSearchInput.addEventListener("input", (e) => {
  renderSkillTransferOptions(e.target.value);
});

skillTransferSearchInput.addEventListener("focus", () => renderSkillTransferOptions(""));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#skillTransferSearch")) {
    skillTransferOptionsDiv.style.display = "none";
  }
});

// searchable autocomplete single-select skill transfer dropdown start