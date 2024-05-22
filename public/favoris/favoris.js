async function getCoiffeursFromServer() {
  try {
    const response = await fetch("/coiffeurs");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des coiffeurs");
    }
    const data = await response.json();
    return data.coiffeurs;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getSalonFromServer(idSalon) {
  try {
    const response = await fetch(`/salon/${idSalon}`);
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

async function getPhotoCoiffeurFromServer(email) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`/recupererphoto/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de la photo du coiffeur");
    }
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error(error);
    return "../logo/R.png";
  }
}


async function retirerDesFavoris(event, coiffeur) {
  try {
    const favoris = await getFavorisFromServer();
    const favoriToDelete = favoris.find(
      (favori) => favori.idCoiffeur === coiffeur.idCoiffeur
    );

    if (!favoriToDelete) {
      throw new Error("Favori non trouvé");
    }

    const response = await fetch(`/favoris/${favoriToDelete.idFavoris}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors du retrait du coiffeur des favoris");
    }

    const data = await response.json();
    console.log(data.message);
    afficherCoiffeurs();
  } catch (error) {
    console.error(error);
  }
}

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
      const fullName = (
        coiffeur.nomCoiffeur +
        " " +
        coiffeur.prenomCoiffeur
      ).toLowerCase();
      if (!fullName.includes(searchInput)) {
        continue;
      }

      const photoUrl = await getPhotoCoiffeurFromServer(coiffeur.email);

      const salon = await getSalonFromServer(coiffeur.idSalon);

      const coiffeurCard = document.createElement("div");
      coiffeurCard.classList.add("coiffeur-card");

      const photo = document.createElement("img");
      photo.src = photoUrl;
      photo.alt = coiffeur.nomCoiffeur + " " + coiffeur.prenomCoiffeur;
      photo.classList.add("coiffeur-photo");
      coiffeurCard.appendChild(photo);

      const nomPrenomContainer = document.createElement("div");
      nomPrenomContainer.classList.add("nom-prenom-container");
      const nomPrenomElement = document.createElement("div");
      nomPrenomElement.textContent =
        coiffeur.nomCoiffeur + " " + coiffeur.prenomCoiffeur;
      nomPrenomElement.classList.add("coiffeur-nom-prenom");
      nomPrenomContainer.appendChild(nomPrenomElement);
      coiffeurCard.appendChild(nomPrenomContainer);

      const infoContainer = document.createElement("div");
      infoContainer.classList.add("coiffeur-info");
      const salonInfo = document.createElement("div");
      salonInfo.textContent = `Nom du salon: ${salon.nomSalon}, Téléphone: ${coiffeur.numCoiffeur}, Email: ${coiffeur.email}, Adresse: ${salon.adresseSalon}`;
      infoContainer.appendChild(salonInfo);
      coiffeurCard.appendChild(infoContainer);

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

      coiffeursContainer.appendChild(coiffeurCard);
    }
  } catch (error) {
    console.error(error);
  }
}

async function ajouterAuxFavoris(event, coiffeur) {
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch("/favoris", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idCoiffeur: coiffeur.idCoiffeur,
        token: token,
      }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du coiffeur aux favoris");
    }
    const data = await response.json();
    console.log(data.message);
    afficherCoiffeurs();
  } catch (error) {
    console.error(error);
  }
}

async function toggleFavorite(event, coiffeur) {
  coiffeur.favori = !coiffeur.favori;
  event.target.innerHTML = coiffeur.favori ? "&#x2665;" : "&#x2661;";
  event.target.classList.toggle("favorite-icon-active", coiffeur.favori);
  event.stopPropagation();

  if (coiffeur.favori) {
    await ajouterAuxFavoris(coiffeur);
  } else {
  }
}

afficherCoiffeurs();

function searchByName() {
  afficherCoiffeurs();
}

function updateNavigationBar(loginType) {
  let navContent = "";
  const navContainer = document.querySelector(".nav .nav-items");
  const prendreRdv = document.getElementById('btnPriseRdv');

  if (loginType === "client") {
    navContent = `
        <a href="#section-contact">Contact</a>
        <a href="../avis.html">Avis</a>
        <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
        <a href="../favoris/favoris.html">Favoris</a>
        <a href="../rendezvousClient/rendezvousClient.html">Mes rendez-vous</a>
        `;
  } else if (loginType === "coiffeur") {
    prendreRdv.style.display = 'none'
    navContent = `
        <a href="../CoiffeurProfil/portfolio.html">Profil</a>
        <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
        <a href="../rendezvousCoiffeur/rendezvousCoiffeur.html">Afficher mes rendez vous</a>
        <a href="../contact/contact.html">Contact</a>
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
