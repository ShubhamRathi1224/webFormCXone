import { BRANDS } from "../data.js";

const brandConfig = {
  holland: {
    logo: "https://www.hollandamerica.com/content/dam/hal/common/site-logos/hal-logo-horizontal.svg",
    tagline: "Explore the World in Comfort",
    primaryColor: "#003d6f",
  },
  princess: {
    logo: "https://www.princess.com/content/dam/princess/brand-logos/princess-cruises-logo-horizontal.svg",
    tagline: "Come Back New",
    primaryColor: "#0066b2",
  },
  seabourn: {
    logo: "https://www.seabourn.com/content/dam/seabourn/logos/seabourn-logo.svg",
    tagline: "Ultra-Luxury Cruising",
    primaryColor: "#1a1a2e",
  },
  cunard: {
    logo: "https://www.cunard.com/content/dam/cunard/logos/cunard-logo.svg",
    tagline: "The Most Famous Ocean Liners in the World",
    primaryColor: "#8b0000",
  },
};

function changeBrand(brand) {
  document.body.className = `theme-${brand}`;
  const config = brandConfig[brand];
  document.getElementById("brandLogo").src = config.logo;
  document.getElementById("tagline").textContent = config.tagline;
}

function switchTab(index) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
}


function handleAction(action) {
  alert(`Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`);
}

function handleFooterAction(action) {
  alert(`Footer Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`);
}

window.changeBrand = changeBrand;
window.switchTab = switchTab;
window.handleAction = handleAction;
window.handleFooterAction = handleFooterAction;




document.addEventListener("DOMContentLoaded", () => {
  setTheme();
  serviceSelector.addEventListener("change", (e) => {
    setTheme(e.target.value);
  });
});

function setTheme(name = "holland") {
  console.log('name: ', name);
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