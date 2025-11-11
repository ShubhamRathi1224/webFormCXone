// Theme switching
function setTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('theme', name);

}

function loadSavedTheme() {
  const saved = localStorage.getItem('theme') || 'cunard';
  setTheme(saved);
  document.getElementById('themeSelector').value = saved;
}

// Dynamic query form logic
function setupQueryFields() {
  const querySelect = document.getElementById('queryType');
  const sections = {
    booking: document.getElementById('bookingFields'),
    payment: document.getElementById('paymentFields'),
    cancellation: document.getElementById('cancellationFields'),
    other: document.getElementById('otherFields'),
  };

  querySelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    Object.keys(sections).forEach((key) => {
      sections[key].hidden = key !== selected;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  setupQueryFields();

  document.getElementById('themeSelector').addEventListener('change', (e) => {
    setTheme(e.target.value);
  });
});
