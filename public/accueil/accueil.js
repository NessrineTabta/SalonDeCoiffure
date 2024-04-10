document.addEventListener("DOMContentLoaded", function () {
    // Vérifie s'il y a un token dans sessionStorage
    const token = sessionStorage.getItem("token");
  
    // Si aucun token n'est trouvé, redirige l'utilisateur vers la page de connexion
    if (!token) {
      window.location.href = "/login.html"; // Redirection vers la page de connexion
      return;
    }
  
    // Vérifie le type de connexion (client ou coiffeur)
    const loginType = sessionStorage.getItem("loginType");
  
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
  
  });
  