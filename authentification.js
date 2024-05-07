/* ------------------------
 * Définition des variables
 * ------------------------ */
const express = require("express");
const router = express.Router();
const db = require("./db.js");
const TOKEN_SECRET_KEY = "WEB_4D2_00003"; //ajout de chaine pour completer le sign token

const jwt = require("jsonwebtoken"); // Assurez-vous d'importer jsonwebtoken correctement

const tokenModule = require("./token"); // Importer le module token

function authentification(req, res, next) {
  const token = req.body.token
  console.log("user", req.user.id);

  // Vérifie la validée du token grace au tableau de token.js
  const verifierToken = tokenModule.verifierToken(token);
  if (!token) {
    return res.status(400).json({ message: "Accès non autorisé" ,});
  }

  jwt.verify(token, TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Token invalide" });
    }

    req.user = user;
    console.log("req",req.body);
    next(); // va executer le prochain code
  });
}

module.exports = authentification;
