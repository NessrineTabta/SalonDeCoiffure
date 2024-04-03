/* ------------------------
 * Définition des variables
 * ------------------------ */
const express = require('express');
const router = express.Router();
const db = require('./db.js');
const TOKEN_SECRET_KEY= 'WEB_4D2_00003'                  //ajout de chaine pour completer le sign token

const jwt = require('jsonwebtoken'); // Assurez-vous d'importer jsonwebtoken correctement

const tokenModule = require('./token'); // Importer le module token


function authentification(req, res, next) {
    const token= req.body.token;

    const verifToken = tokenModule.afficherToken(); // Utiliser la fonction pour obtenir le token actuel depuis le module token
    if (!token || !verifToken || token !== verifToken) {
        return res.status(400).json({ message: 'Accès non autorisé' }); // Vérifiez l'orthographe de "message"
    }

    jwt.verify(token, TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: 'Token invalide' }); // Vérifiez l'orthographe de "message"
        }
        req.user = user;
        next(); // va executer le prochain code
    });
}

router.get('/dashboard', authentification, (req, res) => {
    res.json({ message: 'Bienvenue dans le board sécurisé ' + req.user.username }); // Vérifiez l'orthographe de "message"
});

module.exports =  authentification ;

