document.addEventListener("DOMContentLoaded", function () {
  const btnClient = document.getElementById("btnClient");
  const btnCoiffeur = document.getElementById("btnCoiffeur");

  // Ajouter un écouteur d'événements click aux boutons
  btnClient.addEventListener("click", function () {
    btnClient.classList.add("is-black");
    btnCoiffeur.classList.remove("is-black");
    sessionStorage.setItem("loginType", "client"); // Enregistrer le type de connexion dans sessionStorage
  });

  btnCoiffeur.addEventListener("click", function () {
    btnCoiffeur.classList.add("is-black");
    btnClient.classList.remove("is-black");
    sessionStorage.setItem("loginType", "coiffeur"); // Enregistrer le type de connexion dans sessionStorage
  });

  const loginForm = document.getElementById("formConnexion");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Perform basic validation
    if (!email || !password) {
      alert("Veuillez saisir votre e-mail et votre mot de passe.");
      return;
    }

    // Determine the login route based on button clicked
    const loginType = sessionStorage.getItem("loginType");
    const loginRoute =
      loginType === "client" ? "/loginClient" : "/loginCoiffeur";

    // Send login credentials to the server
    fetch(loginRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur de connexion.");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful login
        // For example, you can store the token in local storage and redirect the user
        sessionStorage.setItem("token", data.token); // Stocker le token dans sessionStorage
        alert("Connexion réussie ! Bienvenue, " + email);
        // Redirect to the appropriate page based on user type
        if (loginType === "client") {
          window.location.href = "/pageAcceuil.html";
        } else {
          window.location.href = "/pageAcceuil.html";
        }
      })
      .catch((error) => {
        // Handle errors, e.g., display error message
        console.error("Erreur :", error);
        alert("Échec de la connexion. Veuillez réessayer.");
      });
  });
});
