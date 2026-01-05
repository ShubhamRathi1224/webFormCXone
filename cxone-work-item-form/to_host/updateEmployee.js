let agentList = [];
async function loadData() {
  const url ="https://shubhamrathi1224.github.io/webFormCXone/cxone-work-item-form/to_host/agentList.json";
  try {
    const res = await fetch(url);
    const resJSON = await res.json();
    agentList = resJSON.agents.map((item) => {
      const activeStatus = item.isActive == true ? 'Active' : 'Inactive';
      const polarId = item.custom1?.split(',')[0];
      return {
        ...item, 
        agent_name: item.firstName + ' ' + item.lastName,
        agent_option: `${item.firstName} ${item.lastName} - ${polarId} - ${item.teamName} - ${activeStatus}`,
      }
    });
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function filterData(query) {
  query = query.toLowerCase();
  const polarId = item.custom1?.split(',')[0] || "";
  return agentList
    .filter((item) => item.agent_name?.toLowerCase().includes(query) || polarId.includes(query))
    .slice(0, 25);
}

let agentSelected = false;

function setupAutocomplete() {
  const input = document.getElementById("search");
  const list = document.getElementById("suggestions");

  input.addEventListener("input", () => {
    agentSelected = false;
    updateConfirmButton();
    list.innerHTML = "";
    const value = input.value.trim();
    if (value.length === 0) return;

    const results = filterData(value);
    if(results.length > 0){
        list.style.border = "1px solid #ccc";
    } else {
        list.style.border = "none";
    }
    results.forEach((result) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.style = "padding: 8px;cursor: pointer;"
      div.addEventListener("mouseenter", () => {
          div.style.background = "#f0f0f0";
      });

      div.addEventListener("mouseleave", () => {
          div.style.background = "white";
      });
      div.textContent = result.agent_option;
      div.onclick = () => {
        input.value = result.agent_option;
        document.getElementById('wi_newAgentId').value=result.agentId;
        list.innerHTML = "";
        list.style.border = "none";

        agentSelected = true;
        updateConfirmButton();
      };
      list.appendChild(div);
    });
  });
}

function updateConfirmButton() {
  const btn = document.getElementById("confirmBtn");

  if (agentSelected) {
    btn.disabled = false;
    btn.style.cursor = "pointer";
    btn.style.opacity = "1";
  } else {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    btn.style.opacity = "0.5";
  }
}

window.onload = async () => {
  await loadData();
  setupAutocomplete();
};
