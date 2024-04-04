document.getElementById('btnClient').addEventListener('click', function () {
    this.classList.add('is-black');
    document.getElementById('btnCoiffeur').classList.remove('is-black');
});

document.getElementById('btnCoiffeur').addEventListener('click', function () {
    this.classList.add('is-black');
    document.getElementById('btnClient').classList.remove('is-black');
});

document.querySelector('.link').addEventListener('click', function(event) {
    event.preventDefault(); // pr eviter le comportement par defaut du lien

    // mettre a jour le contenu du côté droit pour afficher le formulaire dinscription
    const rightSide = document.querySelector('.right-side');
    rightSide.innerHTML = `
        <div class="form-container">
            <img src="logo/2-Photoroom.png-Photoroom.png" alt="" style="padding-bottom: 100px;">
            <div class="field buttons has-addons is-centered">
                <p class="control">
                    <button class="button is-fullwidth is-black active" id="btnClient">Client</button>
                </p>
                <p class="control">
                    <button class="button is-fullwidth" id="btnCoiffeur">Coiffeur</button>
                </p>
            </div>
            <form id="signupForm">
                <!-- Les champs du formulaire ici -->
                <div class="field">
                    <div class="control">
                        <input class="input" placeholder="Nom" type="text" id="nom" name="nom" required>
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <input class="input" placeholder="Prénom" type="text" id="prenom" name="prenom" required>
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <input class="input" placeholder="E-mail" type="email" id="email" name="email" required>
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <input class="input" placeholder="Mot de passe" type="password" id="password" name="password" required>
                    </div>
                </div>
                <div class="control">
                    <input class="button is-black is-fullwidth" type="submit" value="S'inscrire" style="border-radius: 290486px;" id="btnInscription">
                </div>
            </form>
            <br>
            <div><a href="/public/avantPremiere.html" class="link">Retour à la connexion</a></div>
        </div>
    `;

    // changer le type dutilisateur
    document.getElementById('btnClient').addEventListener('click', function () {
        this.classList.add('is-black');
        document.getElementById('btnCoiffeur').classList.remove('is-black');
    });

    document.getElementById('btnCoiffeur').addEventListener('click', function () {
        this.classList.add('is-black');
        document.getElementById('btnClient').classList.remove('is-black');
    });
});

document.querySelector('.link').addEventListener('click', function(event) {
    event.preventDefault(); // pr eviter le comportement par defaut du lien

    const rightSide = document.querySelector('.right-side');
    rightSide.innerHTML = getFormulaireInscription(); // Utilise une fonction pour générer le contenu du formulaire

    // Réinitialise les écouteurs d'événements pour les boutons Client et Coiffeur
    initializeButtonListeners();
});

function initializeButtonListeners() {
    //quand client est cliqué
    document.getElementById('btnClient').addEventListener('click', function () {
        this.classList.add('is-black');
        document.getElementById('btnCoiffeur').classList.remove('is-black');
        const rightSide = document.querySelector('.right-side');
        rightSide.innerHTML = getFormulaireInscription(); // Régénère le contenu sans le dropdown
        initializeButtonListeners(); // Réinitialise les écouteurs d'événements
    });
    // quand coiffeur est cliqué
    document.getElementById('btnCoiffeur').addEventListener('click', function () {
        this.classList.add('is-black');
        document.getElementById('btnClient').classList.remove('is-black');
        const rightSide = document.querySelector('.right-side');
        rightSide.innerHTML = getFormulaireInscription(true); // Génère le contenu avec le dropdown
        initializeButtonListeners(); // Réinitialise les écouteurs d'événements
    });
}

function getFormulaireInscription(isCoiffeur = false) {
    // HTML de base pour le formulaire
    let formContent = `
        <div class="form-container">
            <img src="logo/2-Photoroom.png-Photoroom.png" alt="" style="padding-bottom: 100px;">
            <div class="field buttons has-addons is-centered">
                <p class="control">
                    <button class="button is-fullwidth ${isCoiffeur ? '' : 'is-black'}" id="btnClient">Client</button>
                </p>
                <p class="control">
                    <button class="button is-fullwidth ${isCoiffeur ? 'is-black' : ''}" id="btnCoiffeur">Coiffeur</button>
                </p>
            </div>
    `;

    // Ajoute le dropdown pour le coiffeur
    if (isCoiffeur) {
        formContent += `
            <div class="field">
                <div class="control">
                    <div class="select is-fullwidth">
                        <select id="salon" name="salon">
                            <option value="">Choisir un salon</option>
                            <option value="barbershop1">Barbershop 1</option>
                            <option value="barbershop2">Barbershop 2</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Suite du formulaire (commun a client et coiffeur)
    formContent += `
            <div class="field">
                <div class="control">
                    <input class="input" placeholder="Nom" type="text" id="nom" name="nom" required>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" placeholder="Prénom" type="text" id="prenom" name="prenom" required>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" placeholder="E-mail" type="email" id="email" name="email" required>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" placeholder="Numéro de téléphone" type="tel" id="phone" name="phone" required>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <input class="input" placeholder="Mot de passe" type="password" id="password" name="password" required>
                </div>
            </div>
            <br>
            <div class="control">
                <input class="button is-black is-fullwidth" type="submit" value="S'inscrire" id="btnInscription">
            </div>
        </form>
        <br>
        </div>
        <div><a href="/public/avantPremiere.html" class="link">Retour à la connexion</a></div>

    `;
    return formContent;
}