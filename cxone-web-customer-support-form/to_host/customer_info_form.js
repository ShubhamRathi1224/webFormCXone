const copyrightYear = document.getElementById("copyrightYear");


(function init() {
  copyrightYear.textContent =
    new Date().getFullYear();
})();