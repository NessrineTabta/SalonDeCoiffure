document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);

    const calendarBody = document.getElementById("days");
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const today = new Date();
    let dayInt = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();

    function showDate(e) {
        const showYear = e.getAttribute("data-year");
        const showMonth = e.getAttribute("data-month");
        const showDay = e.getAttribute("data-day");
        document.getElementById("select").innerHTML = `${showDay} ${months[showMonth]} ${showYear}`;
    }

    function showCalendar(month, year) {
        const firstDay = new Date(year, month).getDay();
        calendarBody.innerHTML = "";
        const totalDays = daysInMonth(month, year);

        blankDates(firstDay === 0 ? 6 : firstDay - 1);

        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement("li");
            const cellText = document.createTextNode(day);

            if (dayInt === day && month === today.getMonth() && year === today.getFullYear()) {
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

    function daysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function blankDates(count) {
        for (let x = 0; x < count; x++) {
            const cell = document.createElement("li");
            const cellText = document.createTextNode("");
            cell.appendChild(cellText);
            cell.classList.add("empty");
            calendarBody.appendChild(cell);
        }
    }

    function next() {
        year = month === 11 ? year + 1 : year;
        month = (month + 1) % 12;
        showCalendar(month, year);
        fetchAppointments(month, year);
    }

    function previous() {
        year = month === 0 ? year - 1 : year;
        month = month === 0 ? 11 : month - 1;
        showCalendar(month, year);
        fetchAppointments(month, year);
    }

    showCalendar(month, year);
    document.getElementById("next").addEventListener("click", next);
    document.getElementById("prev").addEventListener("click", previous);

    today.setHours(0, 0, 0, 0);
    const token = sessionStorage.getItem("token");

    async function fetchAppointments(month, year) {
        try {
            const response = await fetch("/rendezVousClients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des rendez-vous du client");
            }

            const rendezVous = await response.json();
            console.log("Fetched Appointments:", rendezVous);

            rendezVous.forEach(appointment => {
                const [hour, minute] = appointment.heureRendezvous.split(':');
                const dateRendezvous = new Date(`${appointment.dateRendezvous}T${hour}:${minute}:00`);

                const localTimeOffset = dateRendezvous.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
                const localDateRendezvous = new Date(dateRendezvous.getTime() - localTimeOffset);

                const cell = document.querySelector(`[data-day="${localDateRendezvous.getDate()}"][data-month="${localDateRendezvous.getMonth()}"][data-year="${localDateRendezvous.getFullYear()}"]`);

                if (cell) {
                    if (localDateRendezvous < today) {
                        cell.style.backgroundColor = "#cccccc";
                        cell.innerHTML = `Rendez-vous passé: ${appointment.heureRendezvous}h`;
                    } else {
                        cell.style.backgroundColor = "rgb(52, 52, 52)";
                        cell.innerHTML = `Rendez-vous pris: ${appointment.heureRendezvous}h <span class="delete-appointment" data-id="${appointment.idRendezvous}" style="cursor: pointer;">🗑️</span>`;

                        const deleteButton = cell.querySelector('.delete-appointment');
                        deleteButton.addEventListener('click', function (e) {
                            e.stopPropagation();
                            if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
                                deleteAppointment(appointment.idRendezvous);
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des rendez-vous du coiffeur:", error);
        }
    }

    fetchAppointments(month, year);

    async function deleteAppointment(idRendezvous) {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`/RendezVous/${idRendezvous}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression du rendez-vous: ${response.statusText}`);
            }
            alert("Rendez-vous annulé avec succès.");
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la suppression du rendez-vous:", error);
            alert("Erreur lors de la suppression du rendez-vous.");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const token = sessionStorage.getItem("token");
    if (!token) {
        window.location.href = "../connexion";
        return;
    }

    const loginType = sessionStorage.getItem("loginType");
    updateNavigationBar(loginType);

    document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);
});

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
            <a href="../RechercheCoiffeur/rechercheCoiffeur.html">Coiffeurs</a>
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

    navContainer.innerHTML = navContent;
}

function deconnexion() {
    sessionStorage.removeItem("token");
    window.location.href = "../connexion.html";
}
