<script>
  const countryCallingCodes = {
    "Kenya": "+254",
    "Tanzania": "+255",
    "Uganda": "+256",
    "Rwanda": "+250",
    "South Africa": "+27",
    "United States": "+1",
    "United Kingdom": "+44",
    "Australia": "+61",
    "Canada": "+1",
    "India": "+91",
    "United Arab Emirates": "+971",
    "France": "+33",
    "Germany": "+49",
    "Italy": "+39",
    "Ireland": "+353"
  };

  const countrySelect = document.getElementById("country");
  const phoneInput = document.getElementById("phone");

  if (countrySelect && phoneInput) {
    countrySelect.addEventListener("change", () => {
      const code = countryCallingCodes[countrySelect.value];
      if (code) {
        phoneInput.value = code + " ";
        phoneInput.focus();
      }
    });
  }
</script>

<script src="/js/nav.js" defer></script>
<script src="/js/inquiry.js" defer></script>

