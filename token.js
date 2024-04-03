/* J'avais le choix entre req.token est un fichier de modularisation du token
    Permettra d'afficher dynamiquement le token sans que l'utilisateur aille a l'écrire
    de plus, il modifiera la valeur d'un token ce qui permettra de logout un utilisateur*/

    let token = null;

    // Fonction pour afficher le token actuel
    function afficherToken() {
        return token;
    }
    
    // Fonction pour modifier le token
    function modifierToken(nouveauToken) {
        token = nouveauToken;
    }
    
    // Exporter les fonctions et le token
    module.exports = {
        afficherToken,
        modifierToken
    };
    