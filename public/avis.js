document.addEventListener("DOMContentLoaded", function () {
  const salonSelect = document.getElementById("salonSelect");
  const coiffeurSelect = document.getElementById("coiffeurSelect");
  const reviewForm = document.getElementById("reviewForm");
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

  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Extracting form data
    const nombreEtoile = parseInt(
      document.querySelector(".rating input").value,
      10
    );
    const salonId = parseInt(document.getElementById("salonSelect").value, 10);

    const description = document.querySelector(
      "textarea[name='opinion']"
    ).value; // Extracting the text from the textarea

    // Assuming you have a session token stored
    const token = sessionStorage.getItem("token");
    console.log("session storage token:", token);
    // Directly retrieving the token here
    /*console.log({
      nombreEtoile: nombreEtoile,
      description: description,
      idSalon: salonId,
    });*/

    // Use the data to make a fetch request to your server

    fetch("http://localhost:3000/avis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombreEtoile: { nombreEtoile },
        description: { description },
        idSalon: { salonId },
        token,
      }),
    })
      .then((response) => {
        if (!response) {
          throw new Error("Failed to submit review");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Review submitted successfully", data);
        alert("⭐⭐⭐⭐⭐ Avis envoyé avec succès ⭐⭐⭐⭐⭐");
        // Here, you might want to clear the form or provide feedback to the user
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        // Handle any errors that occurred during the fetch operation
      });
  });
});
