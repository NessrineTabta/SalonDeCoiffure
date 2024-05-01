document.addEventListener("DOMContentLoaded", function () {
    const token = sessionStorage.getItem("token");
    //rediriger vers connexion si pas de compte
    if (!token) {
      window.location.href = "../connexion.html"; 
      return;
    }
  
    const loginType = sessionStorage.getItem("loginType");
    updateNavigationBar(loginType);
  
    document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);
  
  });
  
  //changer le contenu du navbar en fonction du user (client ou coiffeur)
  function updateNavigationBar(loginType) {
    let navContent = "";
    const navContainer = document.querySelector(".nav .nav-items");
    const prendreRdv = document.getElementById('btnPriseRdv');
  
    if (loginType === "client") {
      navContent = `
        <a href="../accueil/accueil.html#section-contact">Contact</a>
          <a href="../avis.html">Avis</a>
          <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
          <a href="../favoris/favoris.html">Favoris</a>
          <a href="../RechercheCoiffeur/rechercheCoiffeur.html">Coiffeurs</a>
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
  
  // supprimer le token lors de la deconnexion
  function deconnexion() {
    sessionStorage.removeItem("token");
    window.location.href = "../connexion.html";
  }
  

  
