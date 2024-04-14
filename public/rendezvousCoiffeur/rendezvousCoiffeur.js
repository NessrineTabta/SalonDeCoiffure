/* ------------------------
 *   Calendrier dynamique avec les jours, semaines, mois, etc.
 * ------------------------ */
document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);

    // Variables globales
    const calendarBody = document.getElementById("days");
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];
    const today = new Date();
    let dayInt = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();

    // Fonction pour afficher la date sélectionnée
    function showDate(e) {
        const showYear = e.getAttribute("data-year");
        const showMonth = e.getAttribute("data-month");
        const showDay = e.getAttribute("data-day");
        document.getElementById("select").innerHTML =
            showDay + " " + months[showMonth] + " " + showYear;
    }

    // Fonction pour afficher le calendrier
    function showCalendar(month, year) {
        const firstDay = new Date(year, month).getDay();
        calendarBody.innerHTML = "";
        const totalDays = daysInMonth(month, year);

        blankDates(firstDay === 0 ? 6 : firstDay - 1);

        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement("li");
            const cellText = document.createTextNode(day);

            if (
                dayInt === day &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                cell.classList.add("active");
            }

            cell.setAttribute("data-day", day);
            cell.setAttribute("data-month", month);
            cell.setAttribute("data-year", year);

            cell.classList.add("singleDay");
            cell.appendChild(cellText);
            cell.onclick = function (e) {
                showDate(e.target);
            };
            calendarBody.appendChild(cell);
        }

        document.getElementById("month").innerHTML = months[month];
        document.getElementById("year").innerHTML = year;
    }

    // Fonction pour obtenir le nombre de jours dans un mois donné
    function daysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Fonction pour ajouter des cases vides pour commencer le mois au bon jour de la semaine
    function blankDates(count) {
        for (let x = 0; x < count; x++) {
            const cell = document.createElement("li");
            const cellText = document.createTextNode("");
            cell.appendChild(cellText);
            cell.classList.add("empty");
            calendarBody.appendChild(cell);
        }
    }

    // Fonction pour passer au mois suivant
    function next() {
        year = month === 11 ? year + 1 : year;
        month = (month + 1) % 12;
        showCalendar(month, year);
    }

    // Fonction pour passer au mois précédent
    function previous() {
        year = month === 0 ? year - 1 : year;
        month = month === 0 ? 11 : month - 1;
        showCalendar(month, year);
    }

    // Afficher le calendrier
    showCalendar(month, year);

    // Gestion des événements pour les boutons précédent et suivant
    document.getElementById("next").addEventListener("click", next);
    document.getElementById("prev").addEventListener("click", previous);

    // Fetch pour récupérer les rendez-vous du coiffeur
    const token = sessionStorage.getItem("token");
    try {
        const response = await fetch("/rendezVousCoiffeur", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token
            })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des rendez-vous du coiffeur");
        }

        const rendezVous = await response.json();

        // Afficher les rendez-vous sur le calendrier
        rendezVous.forEach(appointment => {
            const { dateRendezvous, heureRendezvous } = appointment;
            const appointmentDate = new Date(dateRendezvous);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normaliser pour ignorer l'heure actuelle

            const cell = document.querySelector(`[data-day="${appointmentDate.getDate()}"][data-month="${appointmentDate.getMonth()}"][data-year="${appointmentDate.getFullYear()}"]`);

            if (cell) {
                const appointmentDiv = document.createElement('div');
                appointmentDiv.className = 'appointment-info';
                appointmentDiv.textContent = `Rendez-vous à ${heureRendezvous}h`;

                // Vérifier si la date du rendez-vous est passée
                if (appointmentDate < today) {
                    appointmentDiv.style.backgroundColor = "#cccccc"; // Gris clair pour les dates passées
                } else {
                    appointmentDiv.style.backgroundColor = "rgb(52,52,52)"; // Couleur normale pour les rendez-vous futurs
                }

                // Ajouter le div du rendez-vous à la cellule du calendrier
                cell.appendChild(appointmentDiv);
            }
        });


    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous du coiffeur:", error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
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

// modifier le navbar en fonction du type de user (client ou coiffeur)
function updateNavigationBar(loginType) {
    let navContent = "";
    const navContainer = document.querySelector(".nav .nav-items"); // Sélectionner le conteneur de la barre de navigation
    const prendreRdv = document.getElementById('btnPriseRdv');

    if (loginType === "client") {
        navContent = `
      <a href="../accueil/accueil.html#section-about">À propos</a>
      <a href="../accueil/accueil.html#section-contact">Contact</a>
          <a href="../avis.html">Avis</a>
          <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
          <a href="../rendezvousClient/rendezvousClient.html">Mes rendez-vous</a>

          `;
    } else if (loginType === "coiffeur") {
        prendreRdv.style.display = 'none'
        navContent = `
          <a href="../CoiffeurProfil/portfolio.html">Profil</a>
          <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
          <a href="../rendezvousCoiffeur/rendezvousCoiffeur.html">Afficher mes rendez vous</a>
          `;
    }

    // Mettre à jour le contenu de la barre de navigation
    navContainer.innerHTML = navContent;
}


function deconnexion() {
    sessionStorage.removeItem("token");
    window.location.href = "../connexion.html";
}
