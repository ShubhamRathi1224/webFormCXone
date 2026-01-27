// Elements
const phoneTypeField = document.getElementById("phoneTypeField");

const CUSTOMER = {
  phoneType: "Mobile",
  phoneTypeImage: "/assets/phoneTypes/mobile.png",
};

let customer = {};

(function init() {
  customer = CUSTOMER;
  setPhoneType(phoneTypeField, customer.phoneType, customer.phoneTypeImage);
})();

function setPhoneType(
  elementDiv,
  phoneType = "Mobile",
  phoneTypeImage = "/assets/phoneTypes/mobile.png"
) {
  if (!elementDiv) return;
  elementDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = phoneTypeImage;
  img.alt = `${phoneType} image`;
  elementDiv.appendChild(img);
}

document.querySelectorAll(".sms-auth-type").forEach((type) => {
  type.addEventListener("click", () => {
    const isActive = type.classList.toggle("active");
    type.dataset.title = isActive
      ? "Customer authorized for this"
      : "Customer not authorized";
    isActive
      ? type.setAttribute("title", "Customer authorized for this")
      : type.setAttribute("title", "Customer not authorized");
  });
});
