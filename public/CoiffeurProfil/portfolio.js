const televerserInput = document.getElementById('televerser');
const imageTeleverser = document.getElementById('imageteleverser');

/* ------------------------
 *    Au chargement mettre l'image
      du coiffeur 
 * ------------------------ */

// Quand quelqu'un clique sur le bouton ''Changer l'image'' cette event va se lancer
televerserInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        // Si un utilisateur insère un fichier, cela va créer un lecteur de fichier
        const reader = new FileReader();
        // Ce lecteur de fichier va téléverser dans le src de <image>
        reader.onload = function(e) {
            // Obtenez l'URL de l'image directement depuis le fichier
            const imageUrl = e.target.result;

            // Convertir le blob en URL
            const blobUrl = URL.createObjectURL(file);

            // Utiliser l'URL convertie comme source de l'image **RESOUS LE PROBLEME DU RELOAD :)))))))))))))))))))))**
            imageTeleverser.src = blobUrl;

            // Envoi de l'image au serveur
            const formData = new FormData();
            formData.append('file', file);

            const token = sessionStorage.getItem("token");
            const data = {
                token: token,
                imageUrl: blobUrl // Stocker le lien de téléchargement dans imageUrl
            };

            fetch('/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Gérer la réponse du serveur ici si nécessaire
            })
            .catch(error => console.error(error));
        };
        // Le fichier sera lu GRACE A UNE URL
        reader.readAsDataURL(file);
    }
});
    
/* ------------------------
 *    Au chargement mettre l'image
      du coiffeur 
 * ------------------------ */
// Au chargement, mettre l'image du coiffeur
document.addEventListener('DOMContentLoaded', async function() {
    // Si la page est rechargé, on va modifier la photo par lancienne
    if (performance.navigation.type === 1) {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch('/recupererphoto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        if (data && data.imageUrl) {
            const imageUrl = data.imageUrl;

            // Définir la source de l'image avec l'URL créée
            imageTeleverser.src = imageUrl;

        } else {
           // Si l'URL de l'image n'est pas disponible, charger une image de secours
           console.error('Une erreur est survenue lors de la récupération de l\'URL de l\'image.');
        }
    } catch (error) {

        console.error('Une erreur est survenue lors de l\'initialisation de l\'image :', error);
    }
    }
});



/* ------------------------
 *   ON RETOURNE TOUT LES SALONS AU CHARGEMENT DE LA PAGE: 
 * ------------------------ */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        //ON FAIT UN FETCH POUR RETOURNER TOUTS LES SALONS
      const response = await fetch("/nomsSalons");
      const nomsSalons = await response.json();
      const selectSalon = document.getElementById("salonCoiffure")
  
      nomsSalons.forEach((salon) => {
        const option = document.createElement("option");
        option.value = salon.idSalon;
        option.textContent = salon.nomSalon;
        selectSalon.appendChild(option);
      });
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des noms de salons:", error);
      alert("Une erreur s'est produite lors de la récupération des noms de salons");
    }
  });
  


/* ------------------------
 *    Modifier les informations
     d'un coiffeur grace au FORMULAIRE
 * ------------------------ */
     const boutonEnregistrer = document.getElementById("BoutonEnregistrer");

     boutonEnregistrer.addEventListener("click", async () => {
         const form = document.getElementById("profilForm");
     
         const nomCoiffeur = form.querySelector("#nomCoiffeur").value;
         const prenomCoiffeur = form.querySelector("#prenomCoiffeur").value;
         const email = form.querySelector("#email").value;
         const numCoiffeur = form.querySelector("#numCoiffeur").value;
         const salonCoiffure = form.querySelector("#salonCoiffure").value;
         const newPassword = form.querySelector("#newPassword").value;
     
         const token = sessionStorage.getItem("token");
     
         try {
             const response = await fetch("/coiffeurs", {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json",
                 },
                 body: JSON.stringify({
                     token,
                     nomCoiffeur,
                     prenomCoiffeur,
                     email,
                     numCoiffeur,
                     salonCoiffure,
                     password: newPassword,
                 }),
             });
     
             if (!response.ok) {
                 const errorMessage = await response.text();
                 throw new Error(errorMessage);
             }
     
             const responseData = await response.json();
             alert(responseData.message); // Affiche un message de succès
         } catch (error) {
             console.error("Une erreur s'est produite lors de la modification du profil :", error.message);
             alert("Une erreur s'est produite Lors de l'insertion");
         }
     });
     






/* ------------------------
 *   Calendrier dynamique avec les jours, semaines, mois, etc.
 * ------------------------ */
const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current month and year as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

/* ----------------
--------
 *    Choisir une heure, date de disponibilité et l'envoyer au serveur dans table Disponibilite
 * ------------------------ */

// Variables globales pour stocker la date et l'heure sélectionnées
let dateSelectionnee = null;
let heureSelectionnee = null;

// Sélectionnez tous les éléments <li> représentant les jours dans le calendrier
const days = document.querySelectorAll('.days li');

// Fonction pour afficher les heures possibles et le bouton Envoyer
// Fonction pour afficher les heures possibles et le bouton Envoyer
function afficherHeuresPossibles() {
    // Placeholder: Remplacez ce bloc avec la logique pour afficher les heures possibles
    const heuresPossibles = [
         '8:00', '9:00', '10:00', '11:00', 
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
        '18:00'
    ];
    const choisirDate = document.getElementById('choisirDate');
    choisirDate.innerHTML = ''; // Efface le contenu précédent

    // Crée des cases à cocher pour chaque heure possible
    heuresPossibles.forEach(heure => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'heure-disponible'; // Assure que les cases à cocher sont regroupées
        input.value = heure;

        const label = document.createElement('label');
        label.textContent = heure;

        input.addEventListener('change', () => {
            // Mettre à jour les heures sélectionnées lorsque l'utilisateur change la sélection
            if (input.checked) {
                heuresSelectionnees.push(input.value);
            } else {
                const index = heuresSelectionnees.indexOf(input.value);
                if (index !== -1) {
                    heuresSelectionnees.splice(index, 1);
                }
            }
            heureSelectionnee = heuresSelectionnees; // Mettre à jour heureSelectionnee avec les heures sélectionnées
        });

        choisirDate.appendChild(input);
        choisirDate.appendChild(label);
        choisirDate.appendChild(document.createElement('br'));
    });

    // Créer le bouton Envoyer
    const boutonEnvoyer = document.createElement('button');
    boutonEnvoyer.textContent = 'Envoyer les disponibilités';
    boutonEnvoyer.setAttribute('class', 'button is-danger');
    boutonEnvoyer.setAttribute('id', 'boutonEnvoyer');

    

    // Ajouter un écouteur d'événement au bouton Envoyer
    boutonEnvoyer.addEventListener('click', () => {
    if (!dateSelectionnee || !heureSelectionnee || heureSelectionnee.length === 0) {
        alert(dateSelectionnee, heureSelectionnee)

        console.error('Veuillez sélectionner une date et au moins une heure.');
        return;
    }

    // Placeholder: Remplacez cette fonction par la logique pour envoyer les disponibilités
    insererDisponibilite(heureSelectionnee)
        .then(idDisponibilite => {
            console.log('Disponibilité envoyée avec succès. ID de la disponibilité:', idDisponibilite);
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de la disponibilité:', error);
        });
});


    choisirDate.appendChild(boutonEnvoyer); // Ajouter le bouton Envoyer au conteneur
}


// Ajoute un écouteur d'événements à chaque jour dans le calendrier
days.forEach(day => {
    day.addEventListener('click', () => {
        // Récupérer la date sélectionnée
        const selectedDay = parseInt(day.textContent);
        const selectedMonth = currMonth; // Utilisez la variable currMonth définie dans votre code
        const selectedYear = currYear; // Utilisez la variable currYear définie dans votre code
        dateSelectionnee = new Date(selectedYear, selectedMonth, selectedDay);

        // Afficher les heures possibles
        afficherHeuresPossibles();
    });
});

// Fonction : pour ajouter une disponibilité avec une transaction
async function insererDisponibilite(dateDisponibilite, heureDisponibilite) {
    const token= sessionStorage.getItem("token");
    try {
        // Placeholder: Remplacez cette ligne par la logique pour effectuer la requête fetch
        const response = await fetch('/disponibilites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateDisponibilite,
                heureDisponibilite,
                token
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la requête fetch');
        }

        const data = await response.json();
        return data.idDisponibilite;
    } catch (error) {
        throw error;
    }
}
