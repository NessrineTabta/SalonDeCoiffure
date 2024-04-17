// Fonction pour récupérer les coiffeurs depuis le serveur
async function getCoiffeursFromServer() {
    try {
        const response = await fetch('/coiffeurs'); // Effectuer une requête GET vers l'endpoint '/coiffeurs'
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des coiffeurs');
        }
        const data = await response.json(); // Convertir la réponse en JSON
        return data.coiffeurs; // Retourner les coiffeurs récupérés
    } catch (error) {
        console.error(error);
        // Gérer l'erreur ici
        return [];
    }
}

// Fonction pour afficher les coiffeurs filtrés par nom ou prénom
async function afficherCoiffeurs() {
    try {
        const coiffeurs = await getCoiffeursFromServer(); // Récupérer les coiffeurs depuis le serveur
        const coiffeursContainer = document.getElementById("coiffeurs-container");
        const searchInput = document.getElementById("searchInput").value.trim().toLowerCase(); // Obtenir la valeur de la barre de recherche

        // Filtrer les coiffeurs en fonction de la valeur de recherche
        const filteredCoiffeurs = coiffeurs.filter(coiffeur =>
            coiffeur.nomCoiffeur.toLowerCase().includes(searchInput) || // Filtrer par nom
            coiffeur.prenomCoiffeur.toLowerCase().includes(searchInput) // Filtrer par prénom
        );

        coiffeursContainer.innerHTML = "";
        filteredCoiffeurs.forEach(coiffeur => {
            // Création de la carte de coiffeur
            const coiffeurCard = document.createElement("div");
            coiffeurCard.classList.add("coiffeur-card");
            
            // Création de l'élément pour la photo du coiffeur
            const photo = document.createElement("img");
            photo.src = coiffeur.photo ? coiffeur.photo : "../logo/R.png"; // Si pas de photo spécifique, utiliser une photo générique
            photo.alt = coiffeur.nomCoiffeur + " " + coiffeur.prenomCoiffeur; // Texte alternatif pour l'accessibilité
            photo.classList.add("coiffeur-photo");
            coiffeurCard.appendChild(photo);
            
            // Création de l'élément pour le nom et le prénom du coiffeur
            const nomPrenomContainer = document.createElement("div");
            nomPrenomContainer.classList.add("nom-prenom-container");
            
            const nomPrenomElement = document.createElement("div");
            nomPrenomElement.textContent = coiffeur.nomCoiffeur + " " + coiffeur.prenomCoiffeur;
            nomPrenomElement.classList.add("coiffeur-nom-prenom");
            nomPrenomContainer.appendChild(nomPrenomElement);
            
            coiffeurCard.appendChild(nomPrenomContainer);
            
            // Création et gestion du cœur de favoris
            const favoriteIcon = document.createElement("span");
            favoriteIcon.classList.add("favorite-icon");
            favoriteIcon.innerHTML = coiffeur.favori ? "&#x2665;" : "&#x2661;"; // Par défaut, le cœur n'est pas en favori
            favoriteIcon.addEventListener("click", (event) => toggleFavorite(event, coiffeur));
            coiffeurCard.appendChild(favoriteIcon);
            
            coiffeursContainer.appendChild(coiffeurCard);
        });
    } catch (error) {
        console.error(error);
        // Gérer l'erreur ici
    }
}
    



// Fonction pour afficher le profil complet d'un coiffeur
function afficherProfil(coiffeur) {
    // Ici, vous pouvez afficher le profil complet du coiffeur, par exemple en ouvrant une modale
    console.log(coiffeur);
}

// Fonction pour basculer l'état de favori d'un coiffeur
function toggleFavorite(event, coiffeur) {
    // Ici, vous pouvez mettre à jour l'état de favori du coiffeur et l'interface utilisateur en conséquence
    coiffeur.favori = !coiffeur.favori;
    event.target.innerHTML = coiffeur.favori ? "&#x2665;" : "&#x2661;";
    event.stopPropagation(); // Pour éviter que le clic ne déclenche la fonction de clic de la carte
}

// Appel initial pour afficher tous les coiffeurs
afficherCoiffeurs();
// Fonction pour filtrer les coiffeurs par nom depuis la barre de recherche
function searchByName() {
    afficherCoiffeurs(); // Appel à la fonction d'affichage des coiffeurs pour appliquer le filtre
}
