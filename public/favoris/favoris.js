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
  
// Fonction pour récupérer les coiffeurs depuis le serveur
async function getCoiffeursFromServer() {
  try {
    const response = await fetch("/coiffeurs"); // Effectuer une requête GET vers l'endpoint '/coiffeurs'
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des coiffeurs");
    }
    const data = await response.json(); // Convertir la réponse en JSON
    return data.coiffeurs; // Retourner les coiffeurs récupérés
  } catch (error) {
    console.error(error);
    // Gérer l'erreur ici
    return [];
  }
}

// Fonction pour récupérer les informations sur le salon depuis le serveur
async function getSalonFromServer(idSalon) {
  try {
    const response = await fetch(`/salon/${idSalon}`); // Utilisez la route pour récupérer le salon par son ID
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des informations sur le salon"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

// Fonction pour retirer un coiffeur des favoris
async function retirerDesFavoris(event, coiffeur) {
  try {
    const favoris = await getFavorisFromServer(); // Récupérer les favoris du serveur
    const favoriToDelete = favoris.find(
      (favori) => favori.idCoiffeur === coiffeur.idCoiffeur
    ); // Trouver le favori correspondant au coiffeur

    if (!favoriToDelete) {
      throw new Error("Favori non trouvé"); // Si le favori n'est pas trouvé, générer une erreur
    }

    const response = await fetch(`/favoris/${favoriToDelete.idFavoris}`, {
      method: "DELETE", // Utiliser la méthode DELETE pour retirer un favori
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors du retrait du coiffeur des favoris");
    }

    const data = await response.json();
    console.log(data.message); // Afficher un message de confirmation dans la console
    afficherCoiffeurs(); // Actualiser l'affichage des coiffeurs après le retrait des favoris
  } catch (error) {
    console.error(error);
    // Gérer l'erreur ici
  }
}

// Fonction pour récupérer les favoris du client depuis le serveur
async function getFavorisFromServer() {
  try {
    const response = await fetch("/favoris");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des favoris");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const token = sessionStorage.getItem("token");

// Fonction pour afficher les coiffeurs filtrés par nom ou prénom
async function afficherCoiffeurs() {
  try {
    const coiffeurs = await getCoiffeursFromServer();
    const favoris = await getFavorisFromServer();

    const coiffeursContainer = document.getElementById("coiffeurs-container");
    const searchInput = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();

    coiffeursContainer.innerHTML = "";

    for (const coiffeur of coiffeurs) {
      // Filtrer les coiffeurs en fonction du nom ou du prénom
      const fullName = (
        coiffeur.nomCoiffeur +
        " " +
        coiffeur.prenomCoiffeur
      ).toLowerCase();
      if (!fullName.includes(searchInput)) {
        continue;
      }

      // Récupérer les informations sur le salon du coiffeur
      const salon = await getSalonFromServer(coiffeur.idSalon);

      // Créer la carte du coiffeur
      const coiffeurCard = document.createElement("div");
      coiffeurCard.classList.add("coiffeur-card");

      // Ajouter la photo du coiffeur
      const photo = document.createElement("img");
      photo.src = coiffeur.photo ? coiffeur.photo : "../logo/R.png";
      photo.alt = coiffeur.nomCoiffeur + " " + coiffeur.prenomCoiffeur;
      photo.classList.add("coiffeur-photo");
      coiffeurCard.appendChild(photo);

      // Ajouter le nom et prénom du coiffeur
      const nomPrenomContainer = document.createElement("div");
      nomPrenomContainer.classList.add("nom-prenom-container");
      const nomPrenomElement = document.createElement("div");
      nomPrenomElement.textContent =
        coiffeur.nomCoiffeur + " " + coiffeur.prenomCoiffeur;
      nomPrenomElement.classList.add("coiffeur-nom-prenom");
      nomPrenomContainer.appendChild(nomPrenomElement);
      coiffeurCard.appendChild(nomPrenomContainer);

      // Ajouter le numéro de téléphone, l'email et l'adresse du salon
      const infoContainer = document.createElement("div");
      infoContainer.classList.add("coiffeur-info");
      const salonInfo = document.createElement("div");
      salonInfo.textContent = `Nom du salon: ${salon.nomSalon}, Téléphone: ${coiffeur.numCoiffeur}, Email: ${coiffeur.email}, Adresse: ${salon.adresseSalon}`;
      infoContainer.appendChild(salonInfo);
      coiffeurCard.appendChild(infoContainer);

      // Ajouter le bouton de favori
      const favoriteButton = document.createElement("button");
      favoriteButton.classList.add("favorite-button");
      const isFavorite = favoris.some(
        (favori) => favori.idCoiffeur === coiffeur.idCoiffeur
      );
      favoriteButton.textContent = isFavorite
        ? "Retirer favoris"
        : "Ajouter favoris";
      favoriteButton.addEventListener("click", (event) => {
        if (isFavorite) {
          retirerDesFavoris(event, coiffeur);
        } else {
          ajouterAuxFavoris(event, coiffeur);
        }
      });
      coiffeurCard.appendChild(favoriteButton);

      // Ajouter la carte du coiffeur au conteneur principal
      coiffeursContainer.appendChild(coiffeurCard);
    }
  } catch (error) {
    console.error(error);
  }
}

// Fonction pour ajouter un coiffeur aux favoris
async function ajouterAuxFavoris(event, coiffeur) {
  const token = sessionStorage.getItem("token"); // Obtenir le token depuis la session

  try {
    const response = await fetch("/favoris", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idCoiffeur: coiffeur.idCoiffeur,
        token: token, // Passer le token dans la requête
      }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du coiffeur aux favoris");
    }
    const data = await response.json();
    console.log(data.message); // Afficher un message de confirmation dans la console
    afficherCoiffeurs(); // Actualiser l'affichage des coiffeurs après l'ajout aux favoris
  } catch (error) {
    console.error(error);
    // Gérer l'erreur ici
  }
}

// Fonction pour basculer l'état de favori d'un coiffeur
async function toggleFavorite(event, coiffeur) {
  // Ici, vous pouvez mettre à jour l'état de favori du coiffeur et l'interface utilisateur en conséquence
  coiffeur.favori = !coiffeur.favori;
  event.target.innerHTML = coiffeur.favori ? "&#x2665;" : "&#x2661;";
  event.target.classList.toggle("favorite-icon-active", coiffeur.favori); // Ajoute ou supprime la classe favorite-icon-active
  event.stopPropagation(); // Pour éviter que le clic ne déclenche la fonction de clic de la carte

  // Si le coiffeur est maintenant en favori, l'ajouter aux favoris
  if (coiffeur.favori) {
    await ajouterAuxFavoris(coiffeur);
  } else {
    // Si le coiffeur est supprimé des favoris, vous pouvez également mettre en œuvre une fonction pour le supprimer de la table des favoris ici
    // await supprimerDesFavoris(coiffeur);
  }
}

// Appel initial pour afficher tous les coiffeurs
afficherCoiffeurs();

// Fonction pour filtrer les coiffeurs par nom depuis la barre de recherche
function searchByName() {
  afficherCoiffeurs(); // Appel à la fonction d'affichage des coiffeurs pour appliquer le filtre
}
