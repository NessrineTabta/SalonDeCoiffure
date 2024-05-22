document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.close-button').addEventListener('click', function () {
        window.history.back() // retourner à la page précédente
    });

    fetchAndPopulateSelect('/nomsSalons', 'salonSelect', 'nomSalon', 'Chercher par salon');
    fetchAndPopulateSelect('/coiffeurs', 'coiffeurSelect', 'nomCoiffeur', 'Chercher par coiffeur');
    fetchAndPopulateSelect('/showServices', 'serviceSelect', 'nom', 'Chercher par service');

    function fetchAndPopulateSelect(url, selectId, propertyName, placeholder) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.message) { // réponse en message
                    data = data.coiffeurs || data.services;
                }
                loadSelectOptions(data, selectId, propertyName, placeholder);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }

    function loadSelectOptions(data, selectId, propertyName, placeholderText) {
        const select = document.getElementById(selectId);
        let optionsHtml = '<option></option>';  // option vide
        data.forEach(item => {
            let value = item.id || item.idSalon || item.idCoiffeur || item.idService;
            let text = item.prenomCoiffeur ? `${item.prenomCoiffeur} ${item[propertyName]}` : item[propertyName]; // concaténer prénom et nom si prénom existe
            optionsHtml += `<option value="${value}">${text}</option>`;
        });
        select.innerHTML = optionsHtml;
        $(`#${selectId}`).select2({
            placeholder: placeholderText,
            allowClear: true
        });
    }

    // Initialiser le calendrier
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        eventClick: afficherDetailsRdv
    });
    calendar.render();

    function fetchAvailabilitiesAndUpdateCalendar() {
        const coiffeurId = document.getElementById('coiffeurSelect').value;
        const salonId = document.getElementById('salonSelect').value;
        const serviceId = document.getElementById('serviceSelect').value;

        const queryParams = new URLSearchParams();
        if (coiffeurId) queryParams.set('idCoiffeur', coiffeurId);
        if (salonId) queryParams.set('idSalon', salonId);
        if (serviceId) queryParams.set('idService', serviceId);

        const queryString = queryParams.toString();

        fetch(`/disponibilites?${queryString}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data received:", data);
                if (data.disponibilites && data.disponibilites.length > 0) {
                    updateCalendar(data.disponibilites);
                } else {
                    console.error('No availabilities found or data is malformed.', data);
                }
            })
            .catch(error => {
                console.error('Failed to fetch availabilities:', error);
                alert("Erreur lors de la récupération des disponibilités.");
            });
    }

    document.getElementById('searchButton').addEventListener('click', function () {
        fetchAvailabilitiesAndUpdateCalendar();
    });

    function updateCalendar(disponibilites) {
        console.log("Updating calendar with:", disponibilites);
        calendar.removeAllEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        disponibilites.forEach(disponibilite => {
            const startDateTime = new Date(disponibilite.dateDisponibilite + 'T' + disponibilite.heureDisponibilite);
            console.log("Adding event:", disponibilite);

            // Check if the date and time are correct
            if (startDateTime >= today) {
                const eventTitle = `${disponibilite.nomCoiffeur} - ${disponibilite.nomSalon}`;
                calendar.addEvent({
                    id: `${disponibilite.idDisponibilite}-${disponibilite.heureDisponibilite}`, // Ensure unique ID
                    title: eventTitle,
                    start: startDateTime.toISOString(),
                    allDay: false,
                    extendedProps: {
                        nomCoiffeur: disponibilite.nomCoiffeur,
                        nomSalon: disponibilite.nomSalon,
                        idDisponibilite: disponibilite.idDisponibilite,
                        idCoiffeur: disponibilite.idCoiffeur
                    }
                });
            }
        });
        calendar.render();
    }

    var selectedEventId = null;

    function afficherDetailsRdv(info) {
        const event = info.event;
        selectedEventId = event.id;
        console.log("Selected Event Data:", event.extendedProps); // Debug log
        document.getElementById('detailCoiffeur').textContent = `Coiffeur: ${event.extendedProps.nomCoiffeur}`;
        document.getElementById('detailSalon').textContent = `Salon: ${event.extendedProps.nomSalon}`;
        const formattedDate = event.start.toLocaleDateString('fr-CA');
        const formattedTime = event.start.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('detailDateTime').textContent = `Date: ${formattedDate}`;
        document.getElementById('detailTime').textContent = `Heure: ${formattedTime}`;
        document.getElementById('detailsRDV').style.display = 'block';
    }

    function confirmerRdv() {
        const event = calendar.getEventById(selectedEventId);
        if (!event || !event.extendedProps || !event.start) {
            console.error("No event selected or event data is incomplete.");
            alert("Erreur: Les informations du rendez-vous sont incomplètes.");
            return;
        }

        const dateRendezvous = event.start.toISOString().split('T')[0]; // Date au format YYYY-MM-DD
        const heureRendezvous = event.start.toISOString().split('T')[1].substring(0, 5); // Heure au format HH:MM

        const idDisponibilite = event.extendedProps.idDisponibilite;
        const idClient = sessionStorage.getItem('idClient');
        const idCoiffeur = event.extendedProps.idCoiffeur;

        if (!idDisponibilite || !idCoiffeur || !idClient) {
            console.error("Disponibilité, coiffeur ou client ID manquant.", {
                idDisponibilite,
                idCoiffeur,
                idClient
            });
            alert("Erreur: Disponibilité, coiffeur ou client ID manquant.");
            return;
        }

        const appointmentData = {
            idDisponibilite,
            idClient,
            idCoiffeur,
            dateRendezvous,
            heureRendezvous,
            token: sessionStorage.getItem('token')
        };

        console.log("Appointment Data:", appointmentData);

        fetch('/creerRendezVous', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                if (data.idRendezvous) {
                    document.getElementById('detailsRDV').style.display = 'none';
                    calendar.refetchEvents();
                }
            })
            .catch(error => {
                console.error('Error creating Rendezvous:', error);
                alert("Failed to create Rendezvous: " + error.message);
            });
    }

    document.getElementById('confirmButton').addEventListener('click', confirmerRdv);

    // Vérification de la session
    function checkSessionStorage() {
        const idClient = sessionStorage.getItem('idClient');
        if (!idClient) {
            console.warn("idClient n'est pas défini dans sessionStorage.");
            alert("Vous devez être connecté pour prendre un rendez-vous.");
            // Rediriger l'utilisateur vers la page de connexion ou afficher un message
        } else {
            console.log("idClient trouvé dans sessionStorage:", idClient);
        }
    }

    checkSessionStorage();
});