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
const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];

const renderCalendar = () => {
    // Mettre à jour la variable de date à chaque rendu du calendrier
    date = new Date(currYear, currMonth, 1);

    let firstDayofMonth = date.getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        // Vérifier si le jour appartient au mois en cours
        let isCurrentMonth = currMonth === date.getMonth() && currYear === date.getFullYear();
        let isToday = isCurrentMonth && i === date.getDate() ? "active" : "";
        let clickEvent = isCurrentMonth ? "selectDate(this)" : "null";
        liTag += `<li class="${isToday}" onclick="${clickEvent}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
}

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0) {
            currMonth = 11;
            currYear--;
        } else if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        }
        renderCalendar();
    });
});

// Fonction pour sélectionner une date
function selectDate(element) {
    const selectedDay = parseInt(element.textContent);
    dateSelectionnee = new Date(currYear, currMonth, selectedDay);

    // Appliquer le style à tous les jours sélectionnés, peu importe le mois
    const allDays = document.querySelectorAll('.days li');
    allDays.forEach(day => {
        day.classList.remove('selected'); // Supprimer la classe 'selected' de tous les jours
    });
    element.classList.add('selected'); // Ajouter la classe 'selected' au jour sélectionné

    // Formatage de la date sélectionnée en format YYYY-MM-DD
    const year = dateSelectionnee.getFullYear();
    let month = dateSelectionnee.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = dateSelectionnee.getDate();
    day = day < 10 ? '0' + day : day;

    const formattedDate = `${year}-${month}-${day}`;
    console.log("Date sélectionnée :", formattedDate);

    // Afficher les heures possibles
    afficherHeuresPossibles();
}



/* ----------------
--------
*    Choisir une heure, date de disponibilité et l'envoyer au serveur dans table Disponibilite
* ------------------------ */

// Variables globales pour stocker la date et l'heure sélectionnées
let dateSelectionnee = null;
let heureSelectionnee = []; // Initialiser le tableau pour stocker les heures sélectionnées

// Sélectionnez tous les éléments <li> représentant les jours dans le calendrier
const days = document.querySelectorAll('.days li');

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
                heureSelectionnee.push(input.value);
            } else {
                const index = heureSelectionnee.indexOf(input.value);
                if (index !== -1) {
                    heureSelectionnee.splice(index, 1);
                }
            }
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
    boutonEnvoyer.addEventListener('click', async () => {
        if (!dateSelectionnee || !heureSelectionnee || heureSelectionnee.length === 0) {
            console.error('Veuillez sélectionner une date et au moins une heure.');
            return;
        }

        const token = sessionStorage.getItem("token");
        const dateISO = formatDateToISO(dateSelectionnee);

        try {
            const responsePromises = heureSelectionnee.map(async (heure) => {
                const response = await fetch('/disponibilites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        dateDisponibilite: dateISO,
                        heureDisponibilite: heure,
                        token
                    })
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la requête fetch');
                }

                const data = await response.json();
                return data.idDisponibilite;
            });

            const results = await Promise.all(responsePromises);
            alert("Disponibilités mis a jour" )
            console.log('Disponibilités envoyées avec succès:', results);
        } catch (error) {
            console.error('Erreur lors de l\'envoi des disponibilités:', error);
        }
    });

    choisirDate.appendChild(boutonEnvoyer); // Ajouter le bouton Envoyer au conteneur
}

// Fonction pour formater la date en format ISO
const formatDateToISO = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month; // Ajoute un zéro devant si le mois est inférieur à 10
    let day = date.getDate();
    day = day < 10 ? '0' + day : day; // Ajoute un zéro devant si le jour est inférieur à 10
    return `${year}-${month}-${day}`;
};

renderCalendar();









/* ----------------
--------
*    Upload des photos dans portfolios
* ------------------------ */

 // Add event listener to each image upload input
// Add event listener to each image upload input
document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInputs = document.querySelectorAll('.image-upload');
    imageUploadInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const image = input.parentNode.querySelector('img');
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Update the src attribute of the image preview
                    image.src = e.target.result;
                    // Store the image URL in sessionStorage
                    sessionStorage.setItem(`image_${input.dataset.index}`, e.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                // If no file is selected, display a message
                image.src = "https://via.placeholder.com/300x200";
                input.parentNode.querySelector('.content').textContent = "No image selected";
            }
        });
    });
});

// Code to fetch and store image URLs
const token = sessionStorage.getItem("token");
const urlPhoto = []; // Déclaration du tableau en dehors de la boucle
for (let i = 1; i <= 3; i++) {
    const imageUrl = sessionStorage.getItem(`image_${i}`);
    if (imageUrl) {
        urlPhoto.push(imageUrl); // Utilisation de la méthode push pour ajouter l'URL à urlPhoto
    }
}


// Effectuer une requête fetch pour stocker les images dans la base de données
fetch('/portfolioimages', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        urlPhoto: urlPhoto,
        token: token
    })
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Erreur lors de la requête fetch');
    }
})
.then(data => {
    console.log(data.message); // Afficher le message renvoyé par le serveur
})
.catch(error => {
    console.error('Erreur lors de la requête fetch:', error);
});



/* 3 photos vont apparaitre au chargfement*/
document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInputs = document.querySelectorAll('.image-upload');
    imageUploadInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const image = input.parentNode.querySelector('img');
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Update the src attribute of the image preview
                    image.src = e.target.result;
                    // Store the image URL in sessionStorage
                    sessionStorage.setItem(`image_${input.dataset.index}`, e.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                // If no file is selected, display a message
                image.src = "https://via.placeholder.com/300x200";
                input.parentNode.querySelector('.content').textContent = "No image selected";
            }
        });
        
        // Load image from sessionStorage on page reload
        const imageUrl = sessionStorage.getItem(`image_${input.dataset.index}`);
        if (imageUrl) {
            const image = input.parentNode.querySelector('img');
            image.src = imageUrl;
        }
    });
});
