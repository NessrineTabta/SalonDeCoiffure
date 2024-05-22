document.addEventListener('DOMContentLoaded', function () {
    fetch('/FormulaireContact')
        .then(response => response.json())
        .then(data => displayContacts(data))
        .catch(error => console.error('Erreur lors de la récupération des données des contacts:', error));
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

function displayContacts(contacts) {
    if (!Array.isArray(contacts)) {
        console.error('Received data is not an array', contacts);
        return;
    }

    const container = document.getElementById('contact-container');
    contacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact-box');
        contactDiv.innerHTML = `
            <div class="contact-info" style="text-transform: uppercase; text-align: center;"><strong> ${contact.name}</strong></div>
            <div class="contact-info"><strong>Email :</strong> ${contact.email}</div>
            <div class="contact-info"><strong>Téléphone :</strong> ${contact.phone}</div>
            <div class="contact-info"><strong>Salon :</strong> ${contact.nomSalon || 'Non spécifié'}</div>
            <div class="contact-info"><strong>Message :</strong> ${contact.message}</div>
        `;
        container.appendChild(contactDiv);
    });
}


// changer navbar en fonction du type de user (client ou coiffeur)
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


function deconnexion() {
    sessionStorage.removeItem("token");
    window.location.href = "../connexion.html";
}