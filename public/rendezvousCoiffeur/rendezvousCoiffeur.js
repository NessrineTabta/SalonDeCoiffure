/* ------------------------
 *   Calendrier dynamique avec les jours, semaines, mois, etc.
 * ------------------------ */
document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);

    const calendarBody = document.getElementById("days");
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    document.getElementById("next").addEventListener("click", () => changeMonth(1));
    document.getElementById("prev").addEventListener("click", () => changeMonth(-1));

    function changeMonth(change) {
        month += change;
        if (month > 11) {
            month = 0;
            year++;
        } else if (month < 0) {
            month = 11;
            year--;
        }
        showCalendar(month, year);
        fetchAppointments(month, year); 
    }

    function showCalendar(month, year) {
        const firstDay = new Date(year, month).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        calendarBody.innerHTML = ""; 
        blankDates(firstDay);
        const today = new Date(); 

        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement("li");
            cell.textContent = day;
            cell.setAttribute("data-day", day);
            cell.setAttribute("data-month", month);
            cell.setAttribute("data-year", year);
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.style.backgroundColor = "rgb(74, 91, 247)"; // case en bleu
                cell.style.color = "white"; // Texte en blanc
            }
            calendarBody.appendChild(cell);
        }
        document.getElementById("month").innerHTML = months[month];
        document.getElementById("year").innerHTML = year;
    }

    function blankDates(firstDay) {
        for (let i = 1; i < firstDay; i++) {
            const cell = document.createElement("li");
            cell.textContent = "";
            calendarBody.appendChild(cell);
        }
    }

    async function fetchAppointments(month, year) {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch("/rendezVousCoiffeur", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, month, year })  
            });
            if (!response.ok) console.log("Failed to fetch appointments");
            const appointments = await response.json();
            displayAppointments(appointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }

    function displayAppointments(appointments) {
        appointments.forEach(appointment => {
            const { dateRendezvous, heureRendezvous } = appointment;
            const appointmentDate = new Date(dateRendezvous);
            const today = new Date();
            today.setHours(0, 0, 0, 0); 

            const cell = document.querySelector(`[data-day="${appointmentDate.getDate()}"][data-month="${appointmentDate.getMonth()}"][data-year="${appointmentDate.getFullYear()}"]`);
            if (cell) {
                const appointmentDiv = document.createElement('div');
                appointmentDiv.className = 'appointment-info';
                appointmentDiv.textContent = `Rendez-vous à ${heureRendezvous}`;

                if (appointmentDate < today) {
                    appointmentDiv.style.backgroundColor = "#cccccc";
                } else {
                    appointmentDiv.style.backgroundColor = "rgb(52,52,52)";
                }
                cell.appendChild(appointmentDiv);
            }
        });
    }

    // Affichez initialement le calendrier pour le mois/année actuels
    showCalendar(month, year);
    fetchAppointments(month, year);
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
