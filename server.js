/* ----------------------
 * Configuration du serveur
 * ---------------------- */

/* Constantes pour le serveur et la base de données */
const express= require('express');
const db = require('./db');
const app = express();
app.use(express.json());
const path = require('path'); // Module path pour manipuler les chemins de fichiers
/* Constantes pour les cookies */
const cookieParser = require('cookie-parser');  
const bodyParser = require('body-parser');


/* Utiliser express.static pour servir les fichiers statiques depuis le dossier "public" */
app.use(express.static('public'));



/* ------------------------
 * Définition des routes
 * ------------------------ */


/* Définir une route GET pour la page d'accueil */
app.get('/', (req, res) => {
  /* Renvoyer le fichier personne.html depuis le dossier "public" */
  res.sendFile(path.join(__dirname, 'public', 'page.html')); //renvoie page html
});


  
/* -------------------
 * Lancement du serveur
 * ------------------- */

app.listen(3000, () => {
    console.log('Serveur en cours dexecution sur le port 3000');
});