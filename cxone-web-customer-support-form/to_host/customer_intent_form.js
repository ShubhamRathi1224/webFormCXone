const copyrightYear = document.getElementById("copyrightYear");

let customer = {};

(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
})();

const userWrapper = document.querySelector(".user-img-wrapper");
const wrongUserInput = document.getElementById("wrongUser");

userWrapper.addEventListener("click", () => {
    userWrapper.classList.toggle("wrong");
    wrongUserInput.value = userWrapper.classList.contains("wrong") ? "1" : "0";
});
