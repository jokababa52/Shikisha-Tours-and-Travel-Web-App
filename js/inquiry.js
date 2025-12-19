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
