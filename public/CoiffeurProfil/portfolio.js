document.addEventListener('DOMContentLoaded', function() {
    const televerserInput = document.getElementById('televerser');
    const imageTeleverser = document.getElementById('imageteleverser');

    // Quand quelqu'un clique sur le bouton ''Changer l'image'' cette event va se lancer
    televerserInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Si un utilisateur insère un fichier, cela va créer un lecteur de fichier
            const reader = new FileReader();
            // Ce lecteur de fichier va téléverser dans le src de <image>
            reader.onload = function(e) {
                imageTeleverser.src = e.target.result;

                // Envoi du fichier et du token au serveur
                const token = sessionStorage.getItem("token"); // Récupérer le token depuis sessionStorage

                fetch('/portfolio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        urlPhoto: e.target.result // Envoyez l'image en base64
                    })
                })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
            };
            // Le fichier sera lu GRACE A UNE URL
            reader.readAsDataURL(file);
        }
    });
});
