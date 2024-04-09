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
        nomClient: formData.get("nom"),
        prenomClient: formData.get("prenom"),
        numClient: formData.get("phone"),
        password: formData.get("password"),
        idSalon: formData.get("salon"),
      };

      try {
        const url = document
          .getElementById("btnClient")
          .classList.contains("is-black")
          ? "/registerClient"
          : "/registerCoiffeur";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message); // Affichage d'un message de succès ou redirection
        } else {
          const errorData = await response.json();
          console.error(errorData.message); // Affichage du message d'erreur retourné par le serveur
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
                              <option value="barbershop1">Barbershop 1</option>
                              <option value="barbershop2">Barbershop 2</option>
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
