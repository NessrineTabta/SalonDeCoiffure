document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);

  const salonSelect = document.getElementById("salonSelect");
  const coiffeurSelect = document.getElementById("coiffeurSelect");
  const reviewForm = document.getElementById("reviewForm");
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

  loadSalons();

  salonSelect.addEventListener("change", function () {
    fetchCoiffeursForSalon(this.value); 
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
          option.value = coiffeur.idCoiffeur; 
          option.textContent = `${coiffeur.nomCoiffeur} ${coiffeur.prenomCoiffeur}`;
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
    event.preventDefault(); 

    // Extraire du donnee
    const nombreEtoile = parseInt(
      document.querySelector(".rating input").value,
      10
    );
    const salonId = parseInt(document.getElementById("salonSelect").value, 10);

    const description = document.querySelector(
      "textarea[name='opinion']"
    ).value; 
    const token = sessionStorage.getItem("token");
    console.log("session storage token:", token);

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
        alert("⭐⭐⭐⭐⭐ Avis envoyé avec succès ⭐⭐⭐⭐⭐")
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "../connexion.html";
    return;
  }

  const loginType = sessionStorage.getItem("loginType");
  updateNavigationBar(loginType);

  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);
});

// modifie le navbar en fonction du type de user (client ou coiffeur)
function updateNavigationBar(loginType) {
  let navContent = "";
  const navContainer = document.querySelector(".nav .nav-items"); // Sélectionner le conteneur de la barre de navigation
  const prendreRdv = document.getElementById('btnPriseRdv');

  if (loginType === "client") {
    navContent = `
    <a href="../accueil/accueil.html#section-about">À propos</a>
    <a href="../accueil/accueil.html#section-contact">Contact</a>
        <a href="../avis.html">Avis</a>
        <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
        <a href="../rendezvousClient/rendezvousClient.html">Mes rendez-vous</a>

        `;
  } else if (loginType === "coiffeur") {
    prendreRdv.style.display = 'none'
    navContent = `
        <a href="../CoiffeurProfil/portfolio.html">Profil</a>
        <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
        <a href="../rendezvousCoiffeur/rendezvousCoiffeur.html">Afficher mes rendez vous</a>
        `;
  }

  // Mettre à jour le contenu de la barre de navigation
  navContainer.innerHTML = navContent;
}


function deconnexion() {
  sessionStorage.removeItem("token");
  window.location.href = "../connexion.html";
}
