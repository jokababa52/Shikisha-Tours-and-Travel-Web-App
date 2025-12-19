document.addEventListener("DOMContentLoaded", () => {

  const residenceSelect = document.getElementById("residence");
  const visitSelect = document.getElementById("visit");

  fetch("/data/countries.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load countries");
      return response.json();
    })
    .then(countries => {

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
