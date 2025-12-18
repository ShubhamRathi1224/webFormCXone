function validateForm() {
  const checkboxes = document.querySelectorAll(
    'input[name="wi_coachCorrReason"]:checked'
  );

  const otherChecked = document.getElementById("otherCoaching").checked;
  const otherText = document
    .getElementById("wi_coachCorrOtherDetails")
    .value.trim();

  let isValid = true;

  if (checkboxes.length === 0) isValid = false;

  if (otherChecked && otherText === "") isValid = false;

  const btn = document.getElementById("confirmBtn");

  if (isValid) {
    btn.disabled = false;
    btn.style.background = "{global:secondaryColor}";
    btn.style.cursor = "pointer";
  } else {
    btn.disabled = true;
    btn.style.background = "#ccc";
    btn.style.cursor = "not-allowed";
  }
}
