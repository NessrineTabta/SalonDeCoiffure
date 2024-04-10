document.addEventListener("DOMContentLoaded", function () {
  const salonSelect = document.getElementById("salonSelect");
  const coiffeurSelect = document.getElementById("coiffeurSelect");
  // Correct placement of loadSalons
  function loadSalons() {
    fetch("/nomsSalons")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((salon) => {
          const option = document.createElement("option");
          option.value = salon.idSalon;
          option.textContent = salon.nomSalon;
          salonSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching salon data:", error));
  }

  // Call loadSalons here to populate the salonSelect dropdown on page load
  loadSalons();

  salonSelect.addEventListener("change", function () {
    fetchCoiffeursForSalon(this.value); // Corrected function call
  });

  function fetchCoiffeursForSalon(salonId) {
    if (!salonId) {
      coiffeurSelect.innerHTML =
        '<option value="">Choisir un coiffeur</option>';
      coiffeurSelect.disabled = true;
      return;
    }

    fetch(`/coiffeursParSalon/${salonId}`)
      .then((response) => response.json())
      .then((coiffeurs) => {
        coiffeurSelect.innerHTML =
          '<option value="">Choisir un coiffeur</option>';
        coiffeurSelect.disabled = false;
        coiffeurs.forEach((coiffeur) => {
          const option = document.createElement("option");
          option.value = coiffeur.idCoiffeur; // Assuming you have idCoiffeur in your coiffeur objects
          option.textContent = `${coiffeur.nomCoiffeur} ${coiffeur.prenomCoiffeur}`; // Adjust based on your object structure
          coiffeurSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching coiffeur data:", error));
  }

  const allStar = document.querySelectorAll(".rating .star");
  const ratingValue = document.querySelector(".rating input");

  allStar.forEach((item, idx) => {
    item.addEventListener("click", function () {
      let click = 0;
      ratingValue.value = idx + 1;

      allStar.forEach((i) => {
        i.classList.replace("bxs-star", "bx-star");
        i.classList.remove("active");
      });
      for (let i = 0; i < allStar.length; i++) {
        if (i <= idx) {
          allStar[i].classList.replace("bx-star", "bxs-star");
          allStar[i].classList.add("active");
        } else {
          allStar[i].style.setProperty("--i", click);
          click++;
        }
      }
    });
  });
});
