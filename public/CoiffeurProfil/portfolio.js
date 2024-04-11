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
            console.error('Une erreur est survenue lors de la récupération de l\'URL de l\'image.');
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'initialisation de l\'image :', error);
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
     