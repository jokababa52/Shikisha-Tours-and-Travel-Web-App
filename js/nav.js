function updateMonthAvailability(selectedYear) {
  const monthRadios = document.querySelectorAll('input[name="month"]');
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0 = Jan

  monthRadios.forEach((radio, index) => {
    const label = radio.closest(".choice-pill");

    // Reset first
    radio.disabled = false;
    label.style.opacity = "1";
    label.style.pointerEvents = "auto";

    // If selected year is current year → disable past months
    if (Number(selectedYear) === currentYear && index < currentMonthIndex) {
      radio.checked = false;
      radio.disabled = true;
      label.classList.remove("selected");
      label.style.opacity = "0.35";
      label.style.pointerEvents = "none";
    }
  });
}


