let items = [];
async function loadData() {
  // items = [
  //     "Alaska",
  //     "Caribbean",
  //     "Europe",
  //     "Transpacific",
  //     "Hawaii",
  //     "Mexico",
  //     "Mediterranean",
  //     "Baltic",
  //     "South America",
  //     "Antarctica",
  // ];

  // const url = "https://rad-tarsier-6813e0.netlify.app/data.json"
  const url =
    "https://shubhamrathi1224.github.io/webFormCXone/cxone-work-item-form/dynamicSearchableAutocomplete/data.json";
  try {
    const res = await fetch(url);
    items = await res.json();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function filterData(query) {
  query = query.toLowerCase();
  return items
    .filter((item) => item.toLowerCase().includes(query))
    .slice(0, 25);
}

function setupAutocomplete() {
  const input = document.getElementById("wi_search");
  const list = document.getElementById("suggestions");

  input.addEventListener("input", () => {
    list.innerHTML = "";
    const value = input.value.trim();
    if (value.length === 0) return;

    const results = filterData(value);

    results.forEach((result) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.style = "padding: 8px;cursor: pointer;"
      div.addEventListener("mouseenter", () => {
        div.style.background = "#f0f0f0;";
      });

      div.addEventListener("mouseleave", () => {
        div.style.background = "white;";
      });
      div.textContent = result;
      div.onclick = () => {
        input.value = result;
        list.innerHTML = "";
      };
      list.appendChild(div);
    });
  });
}

function submitValue() {
  const value = document.getElementById("wi_search").value;

  console.log("CXone available?", window.CXone);
  console.log("Page loaded in CXone?", window.CXone ? "YES" : "NO");

  if (window.CXone) {
    window.CXone.sendMessage({ autocompleteValue: value });
  } else {
    alert("Returned value: " + value);
  }
}

window.onload = async () => {
  await loadData();
  setupAutocomplete();
};
