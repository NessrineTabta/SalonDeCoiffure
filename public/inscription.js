document.addEventListener("DOMContentLoaded", function () {
  // Event delegation for handling form submission
  document
    .querySelector(".right-side")
    .addEventListener("submit", async function (event) {
      // Check if the event target is our form
      if (event.target && event.target.id === "inscriptionForm") {
        event.preventDefault(); // Prevent the form from submitting normally

        // Extract form data
        const formData = new FormData(event.target);
        const requestData = {
          email: formData.get("email"),
          nom: formData.get("nom"),
          prenom: formData.get("prenom"),
          phone: formData.get("phone"),
          password: formData.get("password"),
          salon: formData.get("salonSelect"),
        };

        // Log form data for debugging
        console.log("Form data submitted:", requestData);

        try {
          let endpoint = "";
          let payload = {};

          if (
            document.getElementById("btnClient").classList.contains("is-black")
          ) {
            // Client form data
            endpoint = "/registerClient";
            payload = {
              email: requestData.email,
              nomClient: requestData.nom,
              prenomClient: requestData.prenom,
              numClient: requestData.phone,
              password: requestData.password,
            };
          } else {
            // Coiffeur form data
            endpoint = "/registerCoiffeur";
            payload = {
              email: requestData.email,
              nomCoiffeur: requestData.nom,
              prenomCoiffeur: requestData.prenom,
              numCoiffeur: requestData.phone,
              password: requestData.password,
              idSalon: requestData.salon,
            };
          }
          console.log(JSON.stringify(payload));

          // Send request to the server
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            // Handle success
            const responseData = await response.json();
            console.log("Success:", responseData.message);
            // You can redirect the user or show a success message here
          } else {
            // Handle server-side validation errors or other issues
            const errorData = await response.json();
            console.error("Error response:", errorData.message);
            // You might want to display this error to the user
          }
        } catch (error) {
          // Handle network errors or other exceptions
          console.error("Submission error:", error);
          // Display a generic error message to the user, if appropriate
        }
      }
    });

  // Button listeners and the rest of your initialization code...
});

// The rest of your script (button click handlers, initializeButtonListeners, getFormulaireInscription) remains unchanged.

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
    // Récupération dynamique des noms de salon via une requête fetch
    fetch("/nomsSalons")
      .then((response) => response.json())
      .then((data) => {
        const options = data
          .map(
            (salon) =>
              `<option value="${salon.idSalon}">${salon.nomSalon}</option>`
          )
          .join("");
        document.getElementById(
          "salonSelect"
        ).innerHTML = `<option value="">Choisir un salon</option>${options}`;
      })
      .catch((error) => console.error("Une erreur s'est produite:", error));

    formContent += `
            <div class="field">
                <div class="control">
                    <div class="select is-fullwidth">
                        <select id="salonSelect" name="salonSelect">
                            <option value="">Choisir un salon</option>
                            <!-- Les options seront ajoutées dynamiquement ici -->
                        </select>
                    </div>
                </div>
            </div>
            <!-- Champ caché pour stocker l'ID du salon sélectionné -->
            <input type="hidden" id="idSalonInput" name="idSalon">
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