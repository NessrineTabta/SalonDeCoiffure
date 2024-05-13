document.addEventListener("DOMContentLoaded", function () {
  const btnClient = document.getElementById("btnClient");
  const btnCoiffeur = document.getElementById("btnCoiffeur");

  btnClient.addEventListener("click", function () {
    btnClient.classList.add("is-black");
    btnCoiffeur.classList.remove("is-black");
    sessionStorage.setItem("loginType", "client");
  });

  btnCoiffeur.addEventListener("click", function () {
    btnCoiffeur.classList.add("is-black");
    btnClient.classList.remove("is-black");
    sessionStorage.setItem("loginType", "coiffeur");
  });

  const loginForm = document.getElementById("formConnexion");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Veuillez saisir votre e-mail et votre mot de passe.");
      return;
    }

    const loginType = sessionStorage.getItem("loginType");
    const loginRoute =
      loginType === "client" ? "/loginClient" : "/loginCoiffeur";

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
        sessionStorage.setItem("token", data.token);

        if (loginType === "client") {
          sessionStorage.setItem("idClient", data.idClient); // Stocker idClient
          window.location.href = "./accueil/accueil.html";
        } else {
          sessionStorage.setItem("idCoiffeur", data.idCoiffeur); // Stocker idCoiffeur si nécessaire
          window.location.href = "./accueil/accueil.html";
        }
      })
      .catch((error) => {
        console.error("Erreur :", error);
        alert("Échec de la connexion. Veuillez réessayer.");
      });
  });
});
