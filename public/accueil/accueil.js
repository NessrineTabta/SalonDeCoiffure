document.addEventListener("DOMContentLoaded", function () {
  // Vérifie s'il y a un token dans sessionStorage
  const token = sessionStorage.getItem("token");

  // Si aucun token n'est trouvé, redirige l'utilisateur vers la page de connexion
  if (!token) {
    window.location.href = "/connexion.html"; // Redirection vers la page de connexion
    return;
  }

  // Vérifie le type de connexion (client ou coiffeur)
  const loginType = sessionStorage.getItem("loginType");
  updateNavigationBar(loginType);

  // Sélectionne la navbar en fonction du type de connexion
  const navbarClient = document.getElementById("navbar_client");
  const navbarCoiffeur = document.getElementById("navbar_coiffeur");

  // Affiche la navbar correspondante
  if (loginType === "client") {
    navbarClient.style.display = "block";
    navbarCoiffeur.style.display = "none";
  } else if (loginType === "coiffeur") {
    navbarClient.style.display = "none";
    navbarCoiffeur.style.display = "block";
  }

  function updateNavigationBar(loginType) {
    let navContent = "";
    const navContainer = document.querySelector(".nav .nav-items"); // Sélectionner le conteneur de la barre de navigation

    if (loginType === "client") {
      navContent = `
        <a href="#">À propos</a>
        <a href="#">Contact</a>
        <a href="#">Mes rendez-vous</a>
        <a href="../avis.html">Avis</a>`;
    } else if (loginType === "coiffeur") {
      navContent = `
        <a href="./CoiffeurProfil/index.html">Portfolio</a>
        <a href="#">À propos</a>
        <a href="#">Contact</a>
        <a href="../avis.html">Avis</a>`;
    }
    // Mettre à jour le contenu de la barre de navigation
    navContainer.innerHTML = navContent;
  }

  //fonction pour la deconnexion
  function deconnexion() {
    sessionStorage.removeItem("token");
    window.location.href = "../public/connexion.html";
  }

  // deconnecter et rediriger vers connexion quand btn deconnexion est appuyé
  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);

});