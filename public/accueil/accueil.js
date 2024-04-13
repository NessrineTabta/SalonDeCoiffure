document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/conn"; // Assurez-vous que le chemin est correct
    return;
  }

  const loginType = sessionStorage.getItem("loginType");
  updateNavigationBar(loginType);

  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);
});

function updateNavigationBar(loginType) {
  let navContent = "";
  const navContainer = document.querySelector(".nav .nav-items"); // Sélectionner le conteneur de la barre de navigation
  const prendreRdv = document.getElementById('btnPriseRdv');

  if (loginType === "client") {
    navContent = `
        <a href="../avis.html">Avis</a>
        <a href="../AfficherAvis/afficherAvis.html">Tout les avis</a>
        `;
  } else if (loginType === "coiffeur") {
    prendreRdv.style.display = 'none'
    navContent = `
        <a href="../CoiffeurProfil/portfolio.html">Portfolio</a>
        <a href="../AfficherAvis/afficherAvis.html">Tout les avis</a>
        <a href="../rendezvousCoiffeur/rendezvousCoiffeur.html">Afficher mes rendez vous</a>
        `;
  }

  // Mettre à jour le contenu de la barre de navigation
  navContainer.innerHTML = navContent;
}

// supprimer le token lors de la deconnexion
function deconnexion() {
  sessionStorage.removeItem("token");
  window.location.href = "../connexion.html";
}
