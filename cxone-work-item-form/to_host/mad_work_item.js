const fieldConfig = [
  { key: "transaction_date", label: "Transaction Date" },
  { key: "group_code", label: "Group Code" },
  { key: "adjustment_group", label: "Adjustment Group" },
  { key: "adjustment_type", label: "Adjustment Type" },
  { key: "transaction_type", label: "Transaction Type" },
  { key: "adjustment_amount", label: "Adjustment Amount" },
  { key: "gross_fair_prior", label: "Gross Fare (Prior)" },
  { key: "adjustment_rate", label: "Adjustment Rate" },
  { key: "change_remarks", label: "Change Remarks" }
];


let passengerData = [];

async function loadData() {
  const url =
    "https://shubhamrathi1224.github.io/webFormCXone/cxone-work-item-form/to_host/mad_work_item.json";
  try {
    const res = await fetch(url);
    passengerData = await res.json();
    document.getElementById('voyageNumberValue').innerText = passengerData[0].voyage;
    document.getElementById('bookingNumberValue').innerText = passengerData[0].booking_id;
    document.getElementById('currencyValue').innerText = passengerData[0].currency;
    var seen = {};
    var uniqSubItems = [];
    for (var i = 0; i < passengerData.length; i++) {
      var type = passengerData[i].cancel_item_type;
      if (!seen[type]) {
        seen[type] = true;
        uniqSubItems.push({
          label: type,
          icon: passengerData[i].icon,
          key: "air"
        });
      }
    };
    setupSubItems(uniqSubItems);
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function setupSubItems(uniqSubItems) {
  const container = document.getElementById("subItemList");

  uniqSubItems.forEach(item => {
    const div = document.createElement("div");

    div.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #ffffff;
      border-radius: 2px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-left: 3px solid ${window.global?.secondaryColor || '#0b6efd'};
    `;

    div.onmouseover = function () {
      this.style.background = "#e8f4ff";
      this.style.color = window.global?.secondaryColor || "#0b6efd";
      this.style.transform = "translateX(4px)";
    };

    div.onmouseout = function () {
      this.style.background = "#ffffff";
      this.style.color = "black";
      this.style.transform = "none";
    };

    div.innerHTML = `
      <span style="color:${window.global?.secondaryColor || '#0b6efd'};font-weight:bold;">✓</span>
      <span>${item.label}</span>
      <div style="margin-left:auto;font-size:20px;" title="Cancellation-related work item">
        ${item.icon}
      </div>
    `;

    container.appendChild(div);
  });
}

function initializeTable() {
    const totalPassengers = passengerData.length;
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th style="position: sticky; min-width: 200px; padding: 12px 10px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255, 255, 255, 0.2); white-space: nowrap;">Field Name</th>';
    
    for (let i = 0; i < totalPassengers; i++) {
        headerRow.innerHTML += `<th style="padding: 12px 10px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255, 255, 255, 0.2); white-space: nowrap;">${passengerData[i].customer_id}</th>`;
    }
    document.getElementById('tableHeader').appendChild(headerRow);
    const tbody = document.getElementById('tableBody');
    fieldConfig.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `<td style="padding: 10px;border: 1px solid #e0e0e0;background: #f8f9fa;">${field.label}</td>`;
        for (let i = 0; i < totalPassengers; i++) {
            const td = document.createElement('td');
            const value = i < passengerData.length ? (passengerData[i][field.key] || '') : '';
            td.innerHTML = value;
            td.style = "padding: 10px;border: 1px solid #e0e0e0;background: white;"
            row.appendChild(td);
        }
        tbody.appendChild(row);
    });
}


window.onload = async () => {
  await loadData();
  initializeTable();
  if(document.getElementById('wi_needUserDetails').value === 1){
    document.getElementById('updateEmployeeBtn').style.display = 'block';
  } else {
    document.getElementById('updateEmployeeBtn').style.display = 'none';
  };
};
