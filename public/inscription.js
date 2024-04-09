document.addEventListener("DOMContentLoaded", function () {
  // Écouteur d'événement pour le lien "Retour à la connexion"
  document.querySelector(".link").addEventListener("click", function (event) {
    event.preventDefault(); // Pour éviter le comportement par défaut du lien
    // Redirection vers la page de connexion
    window.location.href = "/connexion.html";
  });

  // Affichage du formulaire d'inscription du client par défaut
  const rightSide = document.querySelector(".right-side");
  rightSide.innerHTML = getFormulaireInscription(false); // Affichage du formulaire du client

  // Écouteur d'événement pour le formulaire d'inscription
  document
    .getElementById("inscriptionForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const requestData = {
        email: formData.get("email"),
        nom: formData.get("nom"),
        prenom: formData.get("prenom"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        salon: formData.get("salon"), // Peut être vide pour les clients
      };

      try {
        if (
          document.getElementById("btnClient").classList.contains("is-black")
        ) {
          // Pour l'inscription d'un client
          const responseClient = await fetch("/registerClient", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: requestData.email,
              nomClient: requestData.nom,
              prenomClient: requestData.prenom,
              numClient: requestData.phone,
              password: requestData.password,
            }),
          });

          if (responseClient.ok) {
            const dataClient = await responseClient.json();
            console.log(dataClient.message); // Affichage du message de succès ou redirection
            console.log(dataClient);
          } else {
            const errorDataClient = await responseClient.json();
            console.error(errorDataClient.message); // Affichage du message d'erreur retourné par le serveur
            console.log(dataClient);
          }
        } else {
          // Pour l'inscription d'un coiffeur
          const responseCoiffeur = await fetch("/registerCoiffeur", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: requestData.email,
              nomCoiffeur: requestData.nom,
              prenomCoiffeur: requestData.prenom,
              numCoiffeur: requestData.phone,
              password: requestData.password,
              idSalon: requestData.salon,
            }),
          });

          if (responseCoiffeur.ok) {
            const dataCoiffeur = await responseCoiffeur.json();
            console.log(dataCoiffeur.message); // Affichage du message de succès ou redirection
          } else {
            const errorDataCoiffeur = await responseCoiffeur.json();
            console.error(errorDataCoiffeur.message); // Affichage du message d'erreur retourné par le serveur
          }
        }
      } catch (error) {
        console.error("Une erreur s'est produite:", error);
      }
    });

  // Écouteur d'événement pour le bouton "Client"
  document.getElementById("btnClient").addEventListener("click", function () {
    if (!this.classList.contains("is-black")) {
      this.classList.add("is-black");
      document.getElementById("btnCoiffeur").classList.remove("is-black");
      const rightSide = document.querySelector(".right-side");
      const formulaire = getFormulaireInscription(false); // Affichage du formulaire du client
      rightSide.innerHTML = formulaire;
      initializeButtonListeners(); // Réinitialisation des écouteurs d'événements
    }
  });

  // Écouteur d'événement pour le bouton "Coiffeur"
  document.getElementById("btnCoiffeur").addEventListener("click", function () {
    if (!this.classList.contains("is-black")) {
      this.classList.add("is-black");
      document.getElementById("btnClient").classList.remove("is-black");
      const rightSide = document.querySelector(".right-side");
      const formulaire = getFormulaireInscription(true); // Affichage du formulaire du coiffeur
      rightSide.innerHTML = formulaire;
      initializeButtonListeners(); // Réinitialisation des écouteurs d'événements
    }
  });
});

function initializeButtonListeners() {
  // Écouteur d'événement pour le bouton "Client"
  document.getElementById("btnClient").addEventListener("click", function () {
    if (!this.classList.contains("is-black")) {
      this.classList.add("is-black");
      document.getElementById("btnCoiffeur").classList.remove("is-black");
      const rightSide = document.querySelector(".right-side");
      const formulaire = getFormulaireInscription(false); // Affichage du formulaire du client
      rightSide.innerHTML = formulaire;
      initializeButtonListeners(); // Réinitialisation des écouteurs d'événements
    }
  });

  // Écouteur d'événement pour le bouton "Coiffeur"
  document.getElementById("btnCoiffeur").addEventListener("click", function () {
    if (!this.classList.contains("is-black")) {
      this.classList.add("is-black");
      document.getElementById("btnClient").classList.remove("is-black");
      const rightSide = document.querySelector(".right-side");
      const formulaire = getFormulaireInscription(true); // Affichage du formulaire du coiffeur
      rightSide.innerHTML = formulaire;
      initializeButtonListeners(); // Réinitialisation des écouteurs d'événements
    }
  });
}

function getFormulaireInscription(isCoiffeur = false) {
  // HTML de base pour le formulaire
  let formContent = `
          <div class="form-container">
              <img src="logo/2-Photoroom.png-Photoroom.png" alt="" style="padding-bottom: 100px;">
              <form id="inscriptionForm" action="${
                isCoiffeur ? "/registerCoiffeur" : "/registerClient"
              }" method="post">
                  <div class="field buttons has-addons is-centered">
                      <p class="control">
                          <button class="button is-fullwidth ${
                            isCoiffeur ? "" : "is-black"
                          }" id="btnClient">Client</button>
                      </p>
                      <p class="control">
                          <button class="button is-fullwidth ${
                            isCoiffeur ? "is-black" : ""
                          }" id="btnCoiffeur">Coiffeur</button>
                      </p>
                  </div>
      `;

  // Ajout du dropdown pour le coiffeur
  if (isCoiffeur) {
    formContent += `
              <div class="field">
                  <div class="control">
                      <div class="select is-fullwidth">
                          <select id="salon" name="salon">
                              <option value="">Choisir un salon</option>
                              <option value="1">AliCut Laval</option>
                              <option value="2">La Belle et La Barbe </option>
                              <option value="3">Empire Barber Shop </option>
                          </select>
                      </div>
                  </div>
              </div>
          `;
  }

  // Suite du formulaire (commun à client et coiffeur)
  formContent += `
              <div class="field">
                  <div class="control">
                      <input class="input" placeholder="Nom" type="text" id="nom" name="nom" required>
                  </div>
              </div>
              <div class="field">
                  <div class="control">
                      <input class="input" placeholder="Prénom" type="text" id="prenom" name="prenom" required>
                  </div>
              </div>
              <div class="field">
                  <div class="control">
                      <input class="input" placeholder="E-mail" type="email" id="email" name="email" required>
                  </div>
              </div>
              <div class="field">
                  <div class="control">
                      <input class="input" placeholder="Numéro de téléphone" type="tel" id="phone" name="phone" required>
                  </div>
              </div>
              <div class="field">
                  <div class="control">
                      <input class="input" placeholder="Mot de passe" type="password" id="password" name="password" required>
                  </div>
              </div>
              <br>
              <div class="control">
                  <input class="button is-black is-fullwidth" type="submit" value="S'inscrire" id="btnInscription">
              </div>
          </form>
          <br>
          <div><a href="/connexion.html" class="link">Retour à la connexion</a></div>
      </div>
      `;
  return formContent;
}
