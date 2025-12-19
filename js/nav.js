document.addEventListener("DOMContentLoaded", () => {

  const panels = document.querySelectorAll(".inquiry-step-panel");
  const maxStep = panels.length;
  let currentStep = 1;

  const btnBack = document.getElementById("btnBack");
  const btnBackBottom = document.getElementById("btnBackBottom");
  const btnNext = document.getElementById("btnNext");
  const btnSubmit = document.getElementById("btnSubmit");
  const progressFill = document.getElementById("progressFill");
  const form = document.getElementById("quoteForm");

  function showStep(step) {
    currentStep = step;

    panels.forEach(panel => {
      panel.classList.toggle("active",
        Number(panel.dataset.stepPanel) === currentStep
      );
    });

    btnBack.disabled = currentStep === 1;
    btnBackBottom.disabled = currentStep === 1;

    btnNext.style.display = currentStep === maxStep ? "none" : "inline-flex";
    btnSubmit.style.display = currentStep === maxStep ? "inline-flex" : "none";

    progressFill.style.width =
      ((currentStep - 1) / (maxStep - 1)) * 100 + "%";
  }

  function validateStep() {
    if (currentStep === 1) {
      return document.querySelectorAll('input[name="destinations"]:checked').length > 0;
    }
    return true;
  }

  btnNext.onclick = () => {
    if (!validateStep()) return;
    if (currentStep < maxStep) showStep(currentStep + 1);
  };

  btnBack.onclick = btnBackBottom.onclick = () => {
    if (currentStep > 1) showStep(currentStep - 1);
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    form.innerHTML = `
      <div class="success-message">
        <h2>Thank you!</h2>
        <p>Our safari experts will contact you shortly.</p>
      </div>
    `;
    progressFill.style.width = "100%";
  });

  showStep(1);
});
