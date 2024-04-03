/* ------------------------
 * Définition des variables
 * ------------------------ */

let tokens = []; // Définir tokens comme un tableau


// Fonction pour modifier le token EN GROS LE SUPPRIMER
function modifierToken(username, nouveauToken) {
   //filtre les tokens par username
    tokens = tokens.filter(token => token.username !== username);
    //rajoute le novueau token a lusername
    tokens.push({ username, token: nouveauToken });
}

// Fonction token associé à un username
function getTokenByUsername(username) {
    for (const token of tokens) {
        if (token.username === username) {
            return token.token;
        }
    }
    return null;
}
    
// fonction pour suppriemr un token
function supprimerToken(tokenASupprimer) {
    tokens = tokens.filter(token => token.token !== tokenASupprimer); // Supprimer le token du tableau
}

// Fonction verifie validé dun token
function verifierToken(token) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].token === token) {
            return true; // Le token est trouvé, donc valide
        }
    }
    return false; // Le token n'est pas trouvé
}


// Module exports
module.exports = {
    modifierToken,
    supprimerToken,
    verifierToken,
    getTokenByUsername 
};
