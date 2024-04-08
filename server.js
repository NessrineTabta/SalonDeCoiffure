/* ------------------------
 * Définition des variables
 * ------------------------ */

//variables des routes
const coiffeurRouter = require("./serverCoiffeur");
const ClientRouter = require("./serverClient");
var express = require("express");
var app = express();
const bodyparser = require("body-parser"); //pour body
app.use(express.json()); //pour json
app.use(bodyparser.json()); //pour json

/* ------------------------
 * Définition des routes
 * ------------------------ */

app.get("/", (req, res) => {
  res.redirect("./public/pageAccueil.html");
});

app.use("/", coiffeurRouter);
app.use("/", ClientRouter);

// Port d'écoute du serveur
app.listen(3000, () => {
  console.log(`Serveur démarré sur le port ${3000}`);
});
