/* ------------------------
 * Définition des variables
 * ------------------------ */

//POUR BASE DE DONNEE ET REQUETE
const db = require("./db");

var express = require("express");
var app = express();
const bodyparser = require("body-parser"); //pour body
app.use(express.json()); //pour json
app.use(bodyparser.json()); //pour json

//pour les tokens
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TOKEN_SECRET_KEY = "WEB_4D2_00003"; //ajout de chaine pour completer le sign token

const authentification = require("./authentification");
const router = express.Router();

router.get("/rendezVousClient", authentification, async (req, res) => {
  try {
    const unEmail = req.user; // Email de l'utilisateur extrait du token
    const rendezVous = await rendezvousCoiffeur(unEmail);
    res.json({
      rendezVous: rendezVous,
      message: "Bienvenue dans le board sécurisé " + req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des rendez-vous.",
    });
  }
});

//fonction rendezvous client
function rendezvousClient(unEmail) {
  return new Promise((resolve, reject) => {
    db.select("*")
      .from("rendezvous")
      .join("Client", "rendezvous.idClient", "=", "Client.idClient")
      .where("Client.email", unEmail)
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = router;
