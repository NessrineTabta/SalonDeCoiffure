document.addEventListener('DOMContentLoaded', function () {
    const salonSelect = document.getElementById('salonSelect');
    const coiffeurSelect = document.getElementById('coiffeurSelect');

    const coiffeursParSalon = {
        "Salon 1": ["Coiffeur 1A", "Coiffeur 1B"],
        "Salon 2": ["Coiffeur 2A", "Coiffeur 2B"],
        // Ajoutez d'autres salons et leurs coiffeurs ici
    };

    salonSelect.addEventListener('change', function () {
        const coiffeurs = coiffeursParSalon[this.value];
        coiffeurSelect.innerHTML = '<option value="">Choisir un coiffeur</option>'; // Réinitialise le select des coiffeurs

        if (coiffeurs) {
            coiffeurSelect.disabled = false; // Active le select des coiffeurs
            coiffeurs.forEach(coiffeur => {
                const option = document.createElement('option');
                option.value = coiffeur;
                option.textContent = coiffeur;
                coiffeurSelect.appendChild(option);
            });
        } else {
            coiffeurSelect.disabled = true; // Désactive le select des coiffeurs si aucun salon n'est sélectionné
        }
    });
    const allStar = document.querySelectorAll('.rating .star')
    const ratingValue = document.querySelector('.rating input')

    allStar.forEach((item, idx) => {
        item.addEventListener('click', function () {
            let click = 0
            ratingValue.value = idx + 1

            allStar.forEach(i => {
                i.classList.replace('bxs-star', 'bx-star')
                i.classList.remove('active')
            })
            for (let i = 0; i < allStar.length; i++) {
                if (i <= idx) {
                    allStar[i].classList.replace('bx-star', 'bxs-star')
                    allStar[i].classList.add('active')
                } else {
                    allStar[i].style.setProperty('--i', click)
                    click++
                }
            }
        })
    })
});
