<<<<<<< HEAD
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
=======

// document.addEventListener('DOMContentLoaded', function () {
//     const salonSelect = document.getElementById("salonFilter");
//     const coiffeurSelect = document.getElementById("coiffeurFilter");
//     const serviceSelect = document.getElementById("serviceFilter");
//     const nextStepBtn = document.getElementById('nextStepBtn');
//     const datesContainer = document.getElementById('dateSelection');
//     const moreTimesBtn = document.getElementById('moreTimesBtn');
//     const filters = document.getElementById('filters');
//     const dateSelection = document.getElementById('dateSelection');
//     const titreHoraire = document.getElementById('selecthoraire');
//     const titreRdv = document.getElementById('rdv');

//     // Initialisation de l'affichage
//     function initialDisplaySetup() {
//         dateSelection.style.display = 'none';
//         moreTimesBtn.style.display = 'none';
//         titreHoraire.style.display = 'none';
//         titreRdv.style.display = 'block';
//         filters.style.display = 'block';
//         nextStepBtn.style.display = 'none';
//     }

//     initialDisplaySetup();

//     // Activation et désactivation des sélecteurs
//     function toggleSelects(enable, ...selects) {
//         selects.forEach(select => {
//             select.disabled = !enable;
//             if (!enable) select.innerHTML = '<option value="">Choisir...</option>';
//         });
//     }

//     toggleSelects(false, salonSelect, coiffeurSelect, serviceSelect);

//     // Chargez les salons depuis le backend
//     loadSalons();

//     salonSelect.addEventListener("change", function () {
//         fetchCoiffeursForSalon(this.value);
//         toggleSelects(false, coiffeurSelect, serviceSelect); // Reset suivant sélecteurs
//     });

//     coiffeurSelect.addEventListener("change", function () {
//         fetchServicesForCoiffeur(this.value);
//         toggleSelects(false, serviceSelect); // Reset suivant sélecteur
//     });

//     serviceSelect.addEventListener("change", function () {
//         checkAllSelections();
//     });

//     // Vérifie si toutes les sélections ont été faites pour activer le bouton de prochaine étape
//     function checkAllSelections() {
//         const allSelected = salonSelect.value && coiffeurSelect.value && serviceSelect.value;
//         nextStepBtn.style.display = allSelected ? 'block' : 'none';
//     }

//     nextStepBtn.addEventListener('click', function () {
//         displayDateSelection();
//         showSelections();
//     });

//     // Affiche les options de date et cache les filtres
//     function displayDateSelection() {
//         filters.style.display = 'none';
//         titreRdv.style.display = 'none';
//         dateSelection.style.display = 'block';
//         moreTimesBtn.style.display = 'block';
//         titreHoraire.style.display = 'block';
//         showNextDates();
//     }

//     function showNextDates() {
//         const nextIndex = Math.min(currentIndex + 5, dates.length); // limite de 5 dates
//         for (let i = currentIndex; i < nextIndex; i++) {
//             const date = dates[i];
//             const label = document.createElement('label');
//             label.style.fontSize = '20px'
//             label.style.lineHeight = '1.8'
//             label.className = 'radio';
//             label.innerHTML = `<input type="radio" name="date" value="${date}"> ${date}`;
//             label.querySelector('input').addEventListener('change', function () {
//                 updateSummaryWithDate(this.value);
//             });
//             datesContainer.appendChild(label);
//         }
//         currentIndex = nextIndex;

//         // afficher ou masquer le bouton "Voir plus" si besoin
//         moreTimesBtn.style.display = currentIndex < dates.length ? 'block' : 'none';

//     }

//     // Affiche le résumé des sélections de l'utilisateur sur le côté droit de la page
//     function showSelections() {
//         const salon = document.getElementById('salonFilter').value;
//         const coiffeur = document.getElementById('coiffeurFilter').value;
//         const service = document.getElementById('serviceFilter').value;

//         // creer le summary des selections
//         const summary = document.createElement('div');
//         summary.id = 'summary';
//         summary.innerHTML = `
//             <p><strong>Salon</strong><br> ${salon}</p>
//             <p><strong>Coiffeur</strong><br> ${coiffeur}</p>
//             <p><strong>Service</strong><br> ${service}</p>
//         `;

//         // inserer le summary dans cote droit
//         const rightSide = document.querySelector('.right-side');
//         rightSide.innerHTML = '';
//         rightSide.appendChild(summary);
//     }

//     function updateSummaryWithDate(date) {
//         const summary = document.querySelector('#summary');
//         if (!summary) {
//             //rien si ya pas de summary
//             return;
//         }

//         // Recherchez un paragraphe existant pour la date et mettez-le à jour ou créez-en un nouveau
//         let dateParagraph = summary.querySelector('#selectedDate');
//         if (!dateParagraph) {
//             dateParagraph = document.createElement('p');
//             dateParagraph.id = 'selectedDate';
//             summary.appendChild(dateParagraph);
//         }
//         dateParagraph.innerHTML = `<strong>Date<br></strong> ${date}`;

//         let confirmButton = summary.querySelector('#confirmButton');
//         if (!confirmButton) {
//             confirmButton = document.createElement('button');
//             confirmButton.id = 'confirmButton';
//             confirmButton.textContent = 'Confirmer le rendez-vous';
//             confirmButton.className = 'button is-primary';
//             confirmButton.style.marginTop = '20px';
//             summary.appendChild(confirmButton);

//             confirmButton.addEventListener('click', function () {
//                 alert('Rendez-vous confirmé !');
//             });
//         }
//     }

//     // Fonctions loadSalons, fetchCoiffeursForSalon, fetchServicesForCoiffeur sont nécessaires ici
//     const service = document.getElementById("serviceFilter");

//     function loadSalons() {
//         fetch("/nomsSalons")
//             .then((response) => response.json())
//             .then((data) => {
//                 salonSelect.innerHTML = '<option value="">Choisir le Salon</option>';
//                 data.forEach((salon) => {
//                     const option = document.createElement("option");
//                     option.value = salon.idSalon;
//                     option.textContent = salon.nomSalon;
//                     salonSelect.appendChild(option);
//                 });
//                 salonSelect.disabled = false; // Active le select
//             })
//             .catch((error) => console.error("Erreur lors du chargement des salons :", error));
//     }

//     // Call loadSalons here to populate the salonSelect dropdown on page load
//     loadSalons();

//     salonSelect.addEventListener("change", function () {
//         fetchCoiffeursForSalon(this.value); // Corrected function call
//     });

//     function fetchCoiffeursForSalon(salonId) {
//         if (!salonId) {
//             coiffeurSelect.innerHTML =
//                 '<option value="">Choisir un coiffeur</option>';
//             coiffeurSelect.disabled = true;
//             return;
//         }

//         fetch(`/coiffeursParSalon/${salonId}`)
//             .then((response) => response.json())
//             .then((coiffeurs) => {
//                 coiffeurSelect.innerHTML =
//                     '<option value="">Choisir un coiffeur</option>';
//                 coiffeurSelect.disabled = false;
//                 coiffeurs.forEach((coiffeur) => {
//                     const option = document.createElement("option");
//                     option.value = coiffeur.idCoiffeur;
//                     option.textContent = `${coiffeur.nomCoiffeur} ${coiffeur.prenomCoiffeur}`;
//                     coiffeurSelect.appendChild(option);
//                 });
//             })
//             .catch((error) => console.error("Error fetching coiffeur data:", error));
//     }


// });
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Chargement des noms des salons
        const responseSalons = await fetch("/nomsSalons");
        if (!responseSalons.ok) {
            throw new Error('Failed to fetch salons');
        }
        const dataSalons = await responseSalons.json();
        if (!dataSalons || dataSalons.length === 0) {
            console.error("Aucun salon trouvé");
            return;
        }
        populateDropdown(dataSalons, 'nomSalon', null, 'idSalon', '#dropdownResultSalon');

        // Chargement des coiffeurs
        const responseCoiffeurs = await fetch(`/coiffeurs`);
        if (!responseCoiffeurs.ok) {
            throw new Error('Failed to fetch coiffeurs');
        }
        const dataCoiffeurs = await responseCoiffeurs.json();
        if (!dataCoiffeurs || dataCoiffeurs.length === 0) {
            console.error("Aucun coiffeur trouvé");
            return;
        }
        populateDropdown(dataCoiffeurs, 'prenomCoiffeur', null, 'idCoiffeur', '#dropdownResultCoiffeur');

        // Chargement des services d'un coiffeur
        // Chargement des services d'un coiffeur
        const idCoiffeur = document.getElementById('dropdownResultCoiffeur').value;
        const responseServices = await fetch(`/servicess/${idCoiffeur}`);

        if (!responseServices.ok) {
            throw new Error('Failed to fetch services');
        }
        const dataServices = await responseServices.json();
        if (!dataServices || dataServices.length === 0) {
            console.error("Aucun service trouvé pour ce coiffeur");
            return;
        }
        populateDropdown(dataServices, 'nom', null, 'idService', '#dropdownResultService');



        // Gestion de l'écouteur pour le bouton de continuation
        const nextStepBtn = document.getElementById('nextStepBtn');
        nextStepBtn.addEventListener('click', async () => {
            const selectedSalon = document.getElementById('dropdownResultSalon').value;
            const selectedCoiffeur = document.getElementById('dropdownResultCoiffeur').value;
            const selectedService = document.getElementById('dropdownResultService').value;

            // Vérification que toutes les valeurs sont sélectionnées
            if (selectedSalon && selectedCoiffeur && selectedService) {
                // Cacher les éléments précédents
                const filters = document.getElementById('filters');
                if (filters) filters.style.display = 'none';

                // Afficher le contenu pour les dates disponibles
                const datesDisponibles = document.getElementById('datesDisponibles');
                if (datesDisponibles) datesDisponibles.style.display = 'block';

                // Chargement des disponibilités des coiffeurs
                const responseDisponibilites = await fetch("/disponibilites");
                if (!responseDisponibilites.ok) {
                    throw new Error('Failed to fetch disponibilites');
                }
                const dataDisponibilites = await responseDisponibilites.json();
                if (!dataDisponibilites || dataDisponibilites.length === 0) {
                    console.error("Aucune disponibilité trouvée");
                    return;
                }
                // Ici, vous pouvez traiter les données de disponibilité comme vous le souhaitez
                console.log("Disponibilités des coiffeurs:", dataDisponibilites);
            } else {
                alert("Veuillez sélectionner un salon, un coiffeur et un service.");
            }
        });

        // Gestion de la sélection des dates disponibles
        const datesSelection = document.getElementById('dateSelection');
        datesSelection.addEventListener('change', () => {
            const selectedDate = datesSelection.value;
            if (selectedDate) {
                // Cacher les éléments précédents
                const datesDisponibles = document.getElementById('datesDisponibles');
                if (datesDisponibles) datesDisponibles.style.display = 'none';

                // Afficher le contenu pour les heures disponibles
                const heuresDisponibles = document.getElementById('heuresDisponibles');
                if (heuresDisponibles) heuresDisponibles.style.display = 'block';
            }
        });

        // Gestion de la sélection de l'heure disponible
        const heuresSelection = document.getElementById('heureSelection');
        heuresSelection.addEventListener('change', () => {
            const selectedHeure = heuresSelection.value;
            if (selectedHeure) {
                // Afficher le bouton de confirmation
                const confirmBtn = document.getElementById('confirmBtn');
                if (confirmBtn) confirmBtn.style.display = 'block';
            }
        });

        // Gestion de la confirmation du rendez-vous
        const confirmBtn = document.getElementById('confirmBtn');
        confirmBtn.addEventListener('click', async () => {
            const selectedSalon = document.getElementById('dropdownResultSalon').value;
            const selectedCoiffeur = document.getElementById('dropdownResultCoiffeur').value;
            const selectedService = document.getElementById('dropdownResultService').value;
            const selectedDate = document.getElementById('dateSelection').value;
            const selectedHeure = document.getElementById('heureSelection').value;

            try {
                const response = await fetch("/Rendezvous", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        dateRendezvous: selectedDate,
                        heureRendezvous: selectedHeure,
                        idCoiffeur: selectedCoiffeur
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    alert("Rendez-vous créé avec succès !");
                } else {
                    console.error("Échec de la création du rendez-vous.");
                    alert("Échec de la création du rendez-vous. Veuillez réessayer.");
                }
            } catch (error) {
                console.error("Erreur lors de la création du rendez-vous:", error);
                alert("Une erreur s'est produite lors de la création du rendez-vous. Veuillez réessayer.");
            }
        });
    } catch (error) {
        console.error(error);
>>>>>>> 4a5a2972e15eeed7f75d3a0a7d1d0e4b47b6d64e
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

<<<<<<< HEAD
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
=======
// Fonction pour peupler un dropdown avec des données
function populateDropdown(items, nameField1, nameField2, idField, selector) {
    const dropdown = document.querySelector(selector);
    dropdown.innerHTML = ''; // Vide le dropdown

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const option = document.createElement('option');
        option.value = item[idField];
        if (nameField2) {
            option.textContent = `${item[nameField1]} ${item[nameField2]}`;
        } else {
            option.textContent = item[nameField1];
        }
        dropdown.appendChild(option);
    }
    
}



// document.addEventListener('DOMContentLoaded', function () {
//     const salonSelect = document.getElementById("salonFilter");
//     const coiffeurSelect = document.getElementById("coiffeurFilter");
//     const serviceSelect = document.getElementById("serviceFilter");
//     const nextStepBtn = document.getElementById('nextStepBtn');
//     const datesContainer = document.getElementById('dateSelection');
//     const moreTimesBtn = document.getElementById('moreTimesBtn');
//     const titreHoraire = document.getElementById('selecthoraire');
//     const titreRdv = document.getElementById('rdv');

//     let currentIndex = 0; // Initialisation de l'indice pour les plages horaires affichées
//     const dates = [
//         "04/22/24 13:00", "04/22/24 14:00", "04/22/24 15:00",
//         "04/23/24 10:00", "04/23/24 11:00", "04/23/24 12:00",
//         "04/24/24 09:00", "04/24/24 11:00", "04/24/24 14:00",
//         "04/25/24 10:00", "04/25/24 12:00", "04/25/24 15:00",
//         "04/26/24 09:30", "04/26/24 11:30", "04/26/24 14:30",
//         "04/27/24 10:30", "04/28/24 13:30", "04/28/24 15:00"
//     ];

//     // Initialisation de l'affichage
//     function initialDisplaySetup() {
//         dateSelection.style.display = 'none';
//         moreTimesBtn.style.display = 'none';
//         titreHoraire.style.display = 'none';
//         titreRdv.style.display = 'block';
//         nextStepBtn.style.display = 'none';
//         // Activation initiale des sélecteurs
//         toggleSelects(false, salonSelect, coiffeurSelect, serviceSelect);
//     }

//     initialDisplaySetup();
//     loadSalons(); // Chargement initial des salons
//     salonSelect.addEventListener("change", function () {
//         fetchCoiffeursForSalon(this.value);
//         checkAllSelections();
//     });

//     coiffeurSelect.addEventListener("change", function () {
//         fetchServicesForCoiffeur(this.value);
//         checkAllSelections();
//     });

//     serviceSelect.addEventListener("change", function () {
//         checkAllSelections();
//     });

//     // Vérifie si toutes les sélections ont été faites
//     function checkAllSelections() {
//         if (salonSelect.value && coiffeurSelect.value && serviceSelect.value) {
//             nextStepBtn.style.display = 'block'; // Affiche le bouton si toutes les sélections sont faites
//         } else {
//             nextStepBtn.style.display = 'none'; // Cache le bouton sinon
//         }
//     }
//     // Activation et désactivation des sélecteurs
//     function toggleSelects(enable, ...selects) {
//         selects.forEach(select => {
//             select.disabled = !enable;
//             if (!enable) select.innerHTML = '<option value="">Choisir...</option>';
//         });
//     }

//     // Chargement des salons depuis le backend
//     function loadSalons() {
//         fetch("/nomsSalons")
//             .then(response => response.json())
//             .then(data => {
//                 data.forEach(salon => {
//                     const option = new Option(salon.nomSalon, salon.idSalon);
//                     salonSelect.add(option);
//                 });
//                 salonSelect.disabled = false;
//             })
//             .catch(error => console.error("Erreur lors du chargement des salons:", error));
//     }

//     salonSelect.addEventListener("change", () => fetchCoiffeursForSalon(salonSelect.value));

//     coiffeurSelect.addEventListener("change", () => fetchServicesForCoiffeur(coiffeurSelect.value));

//     serviceSelect.addEventListener("change", checkAllSelections);

//     nextStepBtn.addEventListener('click', () => {
//         displayDateSelection();
//         showSelections();
//     });

//     // Affichage des options de date et masquage des filtres
//     function displayDateSelection() {
//         filters.style.display = 'none';
//         titreRdv.style.display = 'none';
//         dateSelection.style.display = 'block';
//         moreTimesBtn.style.display = 'block';
//         titreHoraire.style.display = 'block';
//         showNextDates();
//     }

//     // Fonction pour afficher les plages horaires suivantes
//     function showNextDates() {
//         const nextIndex = Math.min(currentIndex + 5, dates.length); // limite de 5 dates
//         for (let i = currentIndex; i < nextIndex; i++) {
//             const date = dates[i];
//             const label = document.createElement('label');
//             label.style.fontSize = '20px'
//             label.style.lineHeight = '1.8'
//             label.className = 'radio';
//             label.innerHTML = `<input type="radio" name="date" value="${date}"> ${date}`;
//             label.querySelector('input').addEventListener('change', function () {
//                 updateSummaryWithDate(this.value);
//             });
//             datesContainer.appendChild(label);
//         }
//         currentIndex = nextIndex;

//         // afficher ou masquer le bouton "Voir plus" si besoin
//         moreTimesBtn.style.display = currentIndex < dates.length ? 'block' : 'none';

//     }

//     // Fonction pour mettre à jour le résumé avec la date sélectionnée
//     function updateSummaryWithDate(date) {
//         const summary = document.querySelector('#summary');
//         if (!summary) {
//             //rien si ya pas de summary
//             return;
//         }

//         // Recherchez un paragraphe existant pour la date et mettez-le à jour ou créez-en un nouveau
//         let dateParagraph = summary.querySelector('#selectedDate');
//         if (!dateParagraph) {
//             dateParagraph = document.createElement('p');
//             dateParagraph.id = 'selectedDate';
//             summary.appendChild(dateParagraph);
//         }
//         dateParagraph.innerHTML = `<strong>Date<br></strong> ${date}`;

//         let confirmButton = summary.querySelector('#confirmButton');
//         if (!confirmButton) {
//             confirmButton = document.createElement('button');
//             confirmButton.id = 'confirmButton';
//             confirmButton.textContent = 'Confirmer le rendez-vous';
//             confirmButton.className = 'button is-primary';
//             confirmButton.style.marginTop = '20px';
//             summary.appendChild(confirmButton);

//             confirmButton.addEventListener('click', function () {
//                 alert('Rendez-vous confirmé !');
//             });
//         }
//     }

//     // Fonction pour afficher le résumé des sélections de l'utilisateur
//     function showSelections() {
//         const salon = document.getElementById('salonFilter').value;
//         const coiffeur = document.getElementById('coiffeurFilter').value;
//         const service = document.getElementById('serviceFilter').value;

//         // creer le summary des selections
//         const summary = document.createElement('div');
//         summary.id = 'summary';
//         summary.innerHTML = `
//             <p><strong>Salon</strong><br> ${salon}</p>
//             <p><strong>Coiffeur</strong><br> ${coiffeur}</p>
//             <p><strong>Service</strong><br> ${service}</p>
//         `;

//         // inserer le summary dans cote droit
//         const rightSide = document.querySelector('.right-side');
//         rightSide.innerHTML = '';
//         rightSide.appendChild(summary);
//     }

//     // Fonctions pour charger les coiffeurs et services
//     function fetchCoiffeursForSalon(salonId) {
//         if (!salonId) {
//             coiffeurSelect.innerHTML =
//                 '<option value="">Choisir un coiffeur</option>';
//             coiffeurSelect.disabled = true;
//             return;
//         }

//         fetch(`/coiffeursParSalon/${salonId}`)
//             .then((response) => response.json())
//             .then((coiffeurs) => {
//                 coiffeurSelect.innerHTML =
//                     '<option value="">Choisir un coiffeur</option>';
//                 coiffeurSelect.disabled = false;
//                 coiffeurs.forEach((coiffeur) => {
//                     const option = document.createElement("option");
//                     option.value = coiffeur.idCoiffeur;
//                     option.textContent = `${coiffeur.nomCoiffeur} ${coiffeur.prenomCoiffeur}`;
//                     coiffeurSelect.appendChild(option);
//                 });
//             })
//             .catch((error) => console.error("Error fetching coiffeur data:", error));
//     }

//     function fetchServicesForCoiffeur(coiffeurId) {
//         serviceSelect.innerHTML = '<option value="">Choisir un service</option>';
//         serviceSelect.disabled = false;
//         if (!coiffeurId) return;

//         fetch(`/services/${coiffeurId}`)
//             .then((response) => response.json())
//             .then((services) => {
//                 serviceSelect.innerHTML = '<option value="">Choisir un service</option>';
//                 serviceSelect.disabled = false;
//                 services.forEach((service) => {
//                     const option = document.createElement("option");
//                     option.value = service.idService;
//                     option.textContent = service.nomService;
//                     serviceSelect.appendChild(option);
//                 });
//             })
//             .catch((error) => console.error("Erreur lors du chargement des services :", error));
//     }
// });




















// const sexeFilter = document.getElementById('sexeFilter');
// const salonFilter = document.getElementById('salonFilter');
// const coiffeurFilter = document.getElementById('coiffeurFilter');
// const serviceFilter = document.getElementById('serviceFilter');

// const salonFilterDiv = salonFilter.closest('.control');
// const coiffeurFilterDiv = coiffeurFilter.closest('.control');
// const serviceFilterDiv = serviceFilter.closest('.control');
// const filters = document.getElementById('filters');
// const dateSelection = document.getElementById('dateSelection');

// const nextStepBtn = document.getElementById('nextStepBtn');
// const leftSide = document.querySelector('.left-side');

// salonFilterDiv.style.display = 'none';
// coiffeurFilterDiv.style.display = 'none';
// serviceFilterDiv.style.display = 'none';
// nextStepBtn.style.display = 'none';

// // pour verifier si toutes les sélections ont été faites
// function checkAllSelections() {
//     const sexeSelected = document.querySelector('input[name="sexe"]:checked') !== null;
//     const salonSelected = salonFilter.value !== "";
//     const coiffeurSelected = coiffeurFilter.value !== "";
//     const serviceSelected = serviceFilter.value !== "";

//     // affiche le bouton etape suivante quand toutes les selections faites
//     if (sexeSelected && salonSelected && coiffeurSelected && serviceSelected) {
//         nextStepBtn.style.display = 'block';
//     } else {
//         nextStepBtn.style.display = 'none';
//     }
// }

// // écouteurs d'événements pour vérifier les sélections à chaque modification
// document.querySelectorAll('input[name="sexe"]').forEach((radio) => {
//     radio.addEventListener('change', checkAllSelections);
// });

// salonFilter.addEventListener('change', checkAllSelections);
// coiffeurFilter.addEventListener('change', checkAllSelections);
// serviceFilter.addEventListener('change', checkAllSelections);

// document.querySelectorAll('input[name="sexe"]').forEach((radio) => {
//     radio.addEventListener('change', function () {
//         if (this.checked) {
//             fillSalonDropdown(this.value); // remplir le sélecteur par le
//             salonFilterDiv.style.display = 'block'; // affiche le prochain choix (salon)
//             salonFilter.disabled = false; // active le sélecteur de salon
//         }
//     });
// });

// salonFilter.addEventListener('change', function () {
//     if (this.value) {
//         fillCoiffeurDropdown(this.value); // remplir le sélecteur par coiffeur
//         coiffeurFilterDiv.style.display = 'block'; // affiche le prochain choix (coiffeur)
//         coiffeurFilter.disabled = false; // active le sélecteur de coiffeur
//     }
// });

// coiffeurFilter.addEventListener('change', function () {
//     if (this.value) {
//         fillServiceDropdown(this.value); // remplir le sélecteur dpar service
//         serviceFilterDiv.style.display = 'block'; // affiche le prochain choix (service)
//         serviceFilter.disabled = false; // active le sélecteur de service
//     }
// });

// function fillSalonDropdown(sexe) {
//     const salons = [...new Set(data.filter(item => item.sexe === sexe).map(item => item.salon))];
//     const salonDropdown = document.getElementById('salonFilter');
//     salonDropdown.innerHTML = '<option value="">Sélectionnez le Salon</option>';
//     salons.forEach(salon => {
//         salonDropdown.innerHTML += `<option value="${salon}">${salon}</option>`;
//     });
//     salonDropdown.disabled = false;
// }

// function fillCoiffeurDropdown(salon) {
//     const coiffeurs = [...new Set(data.filter(item => item.salon === salon).map(item => item.coiffeur))];
//     const coiffeurDropdown = document.getElementById('coiffeurFilter');
//     coiffeurDropdown.innerHTML = '<option value="">Sélectionnez le Coiffeur</option>';
//     coiffeurs.forEach(coiffeur => {
//         coiffeurDropdown.innerHTML += `<option value="${coiffeur}">${coiffeur}</option>`;
//     });
//     coiffeurDropdown.disabled = false;
// }

// function fillServiceDropdown(coiffeur) {
//     const services = data.find(item => item.coiffeur === coiffeur).services;
//     const serviceDropdown = document.getElementById('serviceFilter');
//     serviceDropdown.innerHTML = '<option value="">Sélectionnez le Service</option>';
//     services.forEach(service => {
//         serviceDropdown.innerHTML += `<option value="${service}">${service}</option>`;
//     });
//     serviceDropdown.disabled = false;
// }

// const datesContainer = document.getElementById('dateSelection');
// const moreTimesBtn = document.getElementById('moreTimesBtn');
// const titreHoraire = document.getElementById('selecthoraire');
// const titreRdv = document.getElementById('rdv');

// dateSelection.style.display = 'none';
// moreTimesBtn.style.display = 'none';
// titreHoraire.style.display = 'none';
// titreRdv.style.display = 'block';
// // Exemple de dates à afficher
// const dates = [
//     "04/22/24 13:00", "04/22/24 14:00", "04/22/24 15:00",
//     "04/23/24 10:00", "04/23/24 11:00", "04/23/24 12:00",
//     "04/24/24 09:00", "04/24/24 11:00", "04/24/24 14:00",
//     "04/25/24 10:00", "04/25/24 12:00", "04/25/24 15:00",
//     "04/26/24 09:30", "04/26/24 11:30", "04/26/24 14:30",
//     "04/27/24 10:30", "04/28/24 13:30", "04/28/24 15:00"
// ];

// let currentIndex = 0; // pour suivre le nombre de plages affichées
// nextStepBtn.addEventListener('click', function () {
//     // cacher les filtres et afficher les plages
//     filters.style.display = 'none';
//     titreRdv.style.display = 'none';
//     dateSelection.style.display = 'block';
//     moreTimesBtn.style.display = 'block';
//     titreHoraire.style.display = 'block';


//     // Remplissez et affichez les premières plages horaires disponibles
//     showNextDates();
//     moreTimesBtn.addEventListener('click', showNextDates);

// });

// //pour afficher les plages horaires
// function showNextDates() {
//     const nextIndex = Math.min(currentIndex + 5, dates.length); // limite de 5 dates
//     for (let i = currentIndex; i < nextIndex; i++) {
//         const date = dates[i];
//         const label = document.createElement('label');
//         label.style.fontSize = '20px'
//         label.style.lineHeight = '1.8'
//         label.className = 'radio';
//         label.innerHTML = `<input type="radio" name="date" value="${date}"> ${date}`;
//         label.querySelector('input').addEventListener('change', function () {
//             updateSummaryWithDate(this.value);
//         });
//         datesContainer.appendChild(label);
//     }
//     currentIndex = nextIndex;

//     // afficher ou masquer le bouton "Voir plus" si besoin
//     moreTimesBtn.style.display = currentIndex < dates.length ? 'block' : 'none';
// }
// //pr afficher les selections
// function showSelections() {
//     const salon = document.getElementById('salonFilter').value;
//     const coiffeur = document.getElementById('coiffeurFilter').value;
//     const service = document.getElementById('serviceFilter').value;

//     // creer le summary des selections
//     const summary = document.createElement('div');
//     summary.id = 'summary';
//     summary.innerHTML = `
//         <p><strong>Salon</strong><br> ${salon}</p>
//         <p><strong>Coiffeur</strong><br> ${coiffeur}</p>
//         <p><strong>Service</strong><br> ${service}</p>
//     `;

//     // inserer le summary dans cote droit
//     const rightSide = document.querySelector('.right-side');
//     rightSide.innerHTML = '';
//     rightSide.appendChild(summary);
// }

// nextStepBtn.addEventListener('click', function () {
//     // cacher les autres elements pr montrer les plages horaire
//     filters.style.display = 'none';
//     dateSelection.style.display = 'block';
//     moreTimesBtn.style.display = 'block';

//     showNextDates();
//     moreTimesBtn.addEventListener('click', showNextDates);

//     // Afficher les sélections sur le côté droit
//     showSelections();
// });
// function updateSummaryWithDate(date) {
//     const summary = document.querySelector('#summary');
//     if (!summary) {
//         //rien si ya pas de summary
//         return;
//     }

//     // Recherchez un paragraphe existant pour la date et mettez-le à jour ou créez-en un nouveau
//     let dateParagraph = summary.querySelector('#selectedDate');
//     if (!dateParagraph) {
//         dateParagraph = document.createElement('p');
//         dateParagraph.id = 'selectedDate';
//         summary.appendChild(dateParagraph);
//     }
//     dateParagraph.innerHTML = `<strong>Date<br></strong> ${date}`;

//     let confirmButton = summary.querySelector('#confirmButton');
//     if (!confirmButton) {
//         confirmButton = document.createElement('button');
//         confirmButton.id = 'confirmButton';
//         confirmButton.textContent = 'Confirmer le rendez-vous';
//         confirmButton.className = 'button is-primary';
//         confirmButton.style.marginTop = '20px';
//         summary.appendChild(confirmButton);

//         confirmButton.addEventListener('click', function () {
//             alert('Rendez-vous confirmé !');
//         });
//     }
// }
>>>>>>> 4a5a2972e15eeed7f75d3a0a7d1d0e4b47b6d64e
