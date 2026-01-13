
let customer = {};

(function init() {
  const thumbs = document.querySelectorAll(".thumb");
  const hiddenSatisfiedInput = document.getElementById("satisfied");
  thumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
          thumbs.forEach(t => t.classList.remove("selected"));
          thumb.classList.add("selected");
          hiddenSatisfiedInput.value = thumb.dataset.value;
      });
  });
})();

const userWrapper = document.querySelector(".user-img-wrapper");
const wrongUserInput = document.getElementById("wrongUser");

userWrapper.addEventListener("click", () => {
    userWrapper.classList.toggle("wrong");
    wrongUserInput.value = userWrapper.classList.contains("wrong") ? "1" : "0";
});
