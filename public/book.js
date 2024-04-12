
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

document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function() {
        // Activation de Select2
        $('#dropdownResult').select2({
            placeholder: "Recherchez ici...", // Texte d'indication
            allowClear: true // Permet de réinitialiser la sélection
        });
    });
    const buttons = {
        parSalon: afficherSalon,
        parCoiffeur: afficherCoiffeur,
        parService: afficherService
    };

    Object.keys(buttons).forEach(id => {
        document.getElementById(id).addEventListener('click', function () {
            console.log(`Button ${id} clicked`);
            hideElements();
            buttons[id]();
        });
    });

    function hideElements() {
        console.log("Hiding elements and showing dropdown");
        document.getElementById('filters').style.display = 'none';
        document.getElementById('results').style.display = 'none';
        document.getElementById('dateSelection').style.display = 'none';
        document.getElementById('dropdownResult').style.display = 'block';
    }

    function afficherSalon() {
        fetch("/nomsSalons")
            .then(response => response.json())
            .then(data => {
                console.log("Salons loaded:", data);
                populateDropdown(data, 'nomSalon', 'idSalon');
            })
            .catch(error => console.error("Erreur lors du chargement des salons:", error));
    }

    function afficherCoiffeur() {
        fetch("/nomsCoiffeurs")
            .then(response => response.json())
            .then(data => {
                console.log("Coiffeurs loaded:", data);
                populateDropdown(data, 'nomCoiffeur', 'idCoiffeur');
            })
            .catch(error => console.error("Erreur lors du chargement des coiffeurs:", error));
    }

    function afficherService() {
        fetch("/services")
            .then(response => response.json())
            .then(data => {
                console.log("Services loaded:", data);
                populateDropdown(data.services, 'nomService', 'idService');
            })
            .catch(error => console.error("Erreur lors du chargement des services:", error));
    }

    function populateDropdown(items, nameField, idField) {
        const dropdown = document.getElementById('dropdownResult');
        dropdown.innerHTML = ''; // Clear existing options
    
        // Ajout d'une option par défaut
        const defaultOption = new Option("Sélectionnez une option", "", false, false);
        defaultOption.disabled = true; // Rendre l'option non sélectionnable
        defaultOption.selected = true; // Pré-sélectionner cette option par défaut
        dropdown.add(defaultOption);
    
        // Ajout des autres options provenant de la base de données
        items.forEach(item => {
            const option = new Option(item[nameField], item[idField]);
            dropdown.add(option);
        });
        dropdown.disabled = false;
    }
    
});





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



