/* ------------------------
 * Définition des variables
 * ------------------------ */
const express = require("express");
const router = express.Router();
const db = require("./db.js");
const TOKEN_SECRET_KEY = "WEB_4D2_00003"; //ajout de chaine pour completer le sign token

const jwt = require("jsonwebtoken"); // Assurez-vous d'importer jsonwebtoken correctement

const tokenModule = require("./token"); // Importer le module token

function authentification2(req, res, next) {
    const token = req.headers['x-auth-token']; // Custom header for token
  
    if (!token) {
      return res.status(400).json({ message: "Accès non autorisé" });
    }
  
    jwt.verify(token, TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Token invalide" });
      }
  
      req.user = user;
      next()
    });
  }
  


module.exports = authentification2;