document.addEventListener('DOMContentLoaded', function () {
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
                if (data.message) { // reponse en message
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
        let  optionsHtml = '<option></option>';  // option vide
        data.forEach(item => {
            let value = item.id || item.idSalon || item.idCoiffeur; // bon id utilisé
            let text = item[propertyName];
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

 function fetchAvailabilitiesAndUpdateCalendar(coiffeurId) {
    if (!coiffeurId) {
        console.error('No coiffeur ID provided.');
        return;
    }

    const token = localStorage.getItem('Token');  
    console.log("Sending token:", token);  

    fetch(`/disponibilites/${coiffeurId}`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updateCalendar(data.disponibilites);
    })
    .catch(error => {
        console.error('Failed to fetch availabilities:', error);
    });
}
document.getElementById('searchButton').addEventListener('click', function() {
    const coiffeurId = document.getElementById('coiffeurSelect').value;
    fetchAvailabilitiesAndUpdateCalendar(coiffeurId);
});

 function updateCalendar(disponibilites) {
     calendar.removeAllEvents();
     disponibilites.forEach(a => {
         a.slots.forEach(slot => {
             calendar.addEvent({
                 title: `${a.nomCoiffeur} - ${a.nomSalon}`,
                 start: slot.start, 
                 end: slot.end,  
                 allDay: false,
                 extendedProps: {
                    nomCoiffeur: a.nomCoiffeur,
                    nomSalon: a.nomSalon
                 }
             });
         });
     });
 }

 function afficherDetailsRdv(info) {
     const event = info.event;
     document.getElementById('detailCoiffeur').textContent = `Coiffeur: ${event.extendedProps.nomCoiffeur}`;
     document.getElementById('detailSalon').textContent = `Salon: ${event.extendedProps.nomSalon}`;
     document.getElementById('detailDateTime').textContent = `Date et Heure: ${event.start.toLocaleString()}`;
     document.getElementById('detailsRDV').style.display = 'block';
     document.getElementById('confirmButton').onclick = () => confirmerRdv(event);
 }

 function confirmerRdv(event) {
     alert(`Rendez-vous confirmé avec ${event.extendedProps.nomCoiffeur} au salon ${event.extendedProps.nomSalon} le ${event.start.toLocaleString()}.`);
     document.getElementById('detailsRDV').style.display = 'none';
 }
});
