fetch("/data/countries.json")
  .then(res => res.json())
  .then(countries => {
    const select = document.getElementById("country");
    const phone  = document.getElementById("phone");

    select.innerHTML = `<option value="">Please Select an Option</option>`;

    countries.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      opt.dataset.dial = c.dial;
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      const dial = select.selectedOptions[0]?.dataset.dial;
      if (dial && !phone.value.startsWith(dial)) {
        phone.value = dial + " ";
      }
    });
  });
