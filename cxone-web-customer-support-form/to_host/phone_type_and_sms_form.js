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
