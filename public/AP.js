document.addEventListener("DOMContentLoaded", function () {
  // Écouteur d'événement pour le lien "Retour à la connexion"
  document.querySelector(".link").addEventListener("click", function (event) {
    event.preventDefault(); // Pour éviter le comportement par défaut du lien

    const rightSide = document.querySelector(".right-side");
    rightSide.innerHTML = getFormulaireInscription(); // Utilise une fonction pour générer le contenu du formulaire

    // Réinitialise les écouteurs d'événements pour les boutons Client et Coiffeur
    initializeButtonListeners();
  });

  // Écouteur d'événement pour le formulaire d'inscription
  document.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const requestData = {
      email: formData.get("email"),
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      salon: formData.get("salon"),
    };

    // Vérifier si c'est une inscription client ou coiffeur en fonction du bouton actif
    const url = document
      .getElementById("btnClient")
      .classList.contains("is-black")
      ? "/registerClient"
      : "/registerCoiffeur";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Afficher un message de succès ou effectuer une redirection
      } else {
        const errorData = await response.json();
        console.error(errorData.message); // Afficher le message d'erreur retourné par le serveur
      }
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
    }
  });
});

function initializeButtonListeners() {
  // Écouteur d'événement pour le bouton "Client"
  document.getElementById("btnClient").addEventListener("click", function () {
    this.classList.add("is-black");
    document.getElementById("btnCoiffeur").classList.remove("is-black");
    const rightSide = document.querySelector(".right-side");
    rightSide.innerHTML = getFormulaireInscription(); // Régénère le contenu sans le dropdown
    initializeButtonListeners(); // Réinitialise les écouteurs d'événements
  });

  // Écouteur d'événement pour le bouton "Coiffeur"
  document.getElementById("btnCoiffeur").addEventListener("click", function () {
    this.classList.add("is-black");
    document.getElementById("btnClient").classList.remove("is-black");
    const rightSide = document.querySelector(".right-side");
    rightSide.innerHTML = getFormulaireInscription(true); // Génère le contenu avec le dropdown
    initializeButtonListeners(); // Réinitialise les écouteurs d'événements
  });
}

function getFormulaireInscription(isCoiffeur = false) {
  // HTML de base pour le formulaire
  let formContent = `
          <div class="form-container">
              <img src="logo/2-Photoroom.png-Photoroom.png" alt="" style="padding-bottom: 100px;">
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

  // Ajoute le dropdown pour le coiffeur
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
          </div>
          <div><a href="/connexion.html" class="link">Retour à la connexion</a></div>
  
      `;
  return formContent;
}
