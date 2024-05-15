document.addEventListener("DOMContentLoaded", () => {
  fetch("/avis")
    .then((response) => response.json())
    .then((avis) => {
      const testimonialContainer = document.getElementById(
        "testimonial-container"
      );
      avis.forEach((avis) => {
        // Récupérer le nom complet de l'utilisateur associé à l'avis
        fetch(`/client/${avis.idClient}`)
          .then((response) => response.json())
          .then((user) => {
            const fullName = `${user.nomClient} ${user.prenomClient}`;

            // Afficher l'avis avec le nom complet de l'utilisateur
            testimonialContainer.innerHTML += `
              <div class="testimonial-box">
                <div class="box-top">
                  <div class="profile">
                    <div class="name-user">
                      <strong>${fullName}</strong>
                    </div>
                  </div>
                  <div class="reviews">
                    ${generateStars(avis.nombreEtoile)}
                  </div>
                </div>
                <div class="client-comment">
                  <p>${avis.description}</p>
                </div>
              </div>`;
          })
          .catch((error) =>
            console.error(
              "Erreur lors de la récupération du nom d'utilisateur :",
              error
            )
          );
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des avis :", error)
    );
});

function generateStars(nombreEtoile) {
  let starsHTML = "";
  for (let i = 0; i < nombreEtoile; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  for (let i = nombreEtoile; i < 5; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  return starsHTML;
}


document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token");
  //redirection si pas de compte
  if (!token) {
    window.location.href = "../connexion.html";
    return;
  }

  const loginType = sessionStorage.getItem("loginType");
  updateNavigationBar(loginType);

  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);
});

// changer navbar en fonction du type de user (client ou coiffeur)
function updateNavigationBar(loginType) {
  let navContent = "";
  const navContainer = document.querySelector(".nav .nav-items");
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