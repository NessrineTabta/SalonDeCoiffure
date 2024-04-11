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