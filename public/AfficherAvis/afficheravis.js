document.addEventListener("DOMContentLoaded", () => {
  fetch("/avis")
    .then((response) => response.json())
    .then((avis) => {
      const testimonialContainer = document.getElementById(
        "testimonial-container"
      );
      avis.forEach((avis) => {
        // Récupérer le nom complet de l'utilisateur associé à l'avis
        fetch(`/client/${avis.idClient}`)
          .then((response) => response.json())
          .then((user) => {
            const fullName = `${user.nomClient} ${user.prenomClient}`;

            // Afficher l'avis avec le nom complet de l'utilisateur
            testimonialContainer.innerHTML += `
              <div class="testimonial-box">
                <div class="box-top">
                  <div class="profile">
                    <div class="name-user">
                      <strong>${fullName}</strong>
                    </div>
                  </div>
                  <div class="reviews">
                    ${generateStars(avis.nombreEtoile)}
                  </div>
                </div>
                <div class="client-comment">
                  <p>${avis.description}</p>
                </div>
              </div>`;
          })
          .catch((error) =>
            console.error(
              "Erreur lors de la récupération du nom d'utilisateur :",
              error
            )
          );
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des avis :", error)
    );
});

function generateStars(nombreEtoile) {
  let starsHTML = "";
  for (let i = 0; i < nombreEtoile; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  for (let i = nombreEtoile; i < 5; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  return starsHTML;
}
