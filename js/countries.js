document.addEventListener("DOMContentLoaded", () => {

  const residenceSelect = document.getElementById("residence");
  const visitSelect = document.getElementById("visit");

  fetch("/data/countries.json")
  .then(res => res.json())
  .then(countries => {
    const residence = document.getElementById("residence");
    const visit = document.getElementById("visit");

    residence.innerHTML = `<option value="">Select your country</option>`;
    visit.innerHTML = `<option value="">Select country to visit</option>`;

    countries.forEach(country => {
      residence.innerHTML += `<option value="${country}">${country}</option>`;
      visit.innerHTML += `<option value="${country}">${country}</option>`;
    });
  });


      // Sort alphabetically
      countries.sort((a, b) => a.name.localeCompare(b.name));

      countries.forEach(country => {
        const option1 = document.createElement("option");
        option1.value = country.name;
        option1.textContent = country.name;

        const option2 = option1.cloneNode(true);

        residenceSelect.appendChild(option1);
        visitSelect.appendChild(option2);
      });
    })
    .catch(error => {
      console.error("Country loading error:", error);
    });

});
