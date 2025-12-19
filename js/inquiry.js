document.addEventListener("DOMContentLoaded", () => {

  /* COUNTRY CALLING CODES */
  const countryCallingCodes = {
    Kenya: "+254",
    Tanzania: "+255",
    Uganda: "+256",
    Rwanda: "+250",
    "South Africa": "+27",
    "United States": "+1",
    "United Kingdom": "+44",
    Canada: "+1",
    Australia: "+61",
    India: "+91",
    "United Arab Emirates": "+971"
  };

  const countrySelect = document.getElementById("country");
  const phoneInput = document.getElementById("phone");

  if (countrySelect && phoneInput) {
    countrySelect.addEventListener("change", () => {
      const code = countryCallingCodes[countrySelect.value];
      if (code) phoneInput.value = code + " ";
    });
  }

});

const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

let currentStep = 0;

function updateSteps() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  backBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  nextBtn.hidden = currentStep === steps.length - 1;
  submitBtn.hidden = currentStep !== steps.length - 1;
}

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateSteps();
  }
});

backBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateSteps();
  }
});

updateSteps();
