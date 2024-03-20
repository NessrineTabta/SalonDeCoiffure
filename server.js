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

/* ------------------------
 * Définition des routes
 * ------------------------ */



/* AUTHENTIFICATION DEMANDÉ */

function authentification(req, res, next) {
  const token = req.body.token;
  if (!token) {
      return res.status(400).json({ message: 'Accès non autorisé' });
  }

  jwt.verify(token, TOKEN_SECRET_KEY, (err, decodedToken) => {
      if (err) {
          return res.status(400).json({ message: 'Token invalide' });
      }
      req.user = decodedToken.email; // Accès direct à l'email à partir du token décodé
      next(); // va executer le prochain code
  });
}

/* ------------------------
 *       COTÉ COIFFEUR
 * ------------------------ */

//rendez vous coté coiffeur
app.get('/rendezVousCoiffeur', authentification, async (req, res) => {
  try {
      const unEmail = req.user; // Email de l'utilisateur extrait du token
      const rendezVous = await rendezvousCoiffeur(unEmail);
      res.json({ rendezVous: rendezVous, message: 'Bienvenue dans le board sécurisé ' + req.user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des rendez-vous.' });
  }
});

//fonction rendezvous coiffeur
function rendezvousCoiffeur(unEmail) {
  return new Promise((resolve, reject) => {
    db.select('*')
      .from('rendezvous')
      .join('Coiffeur', 'rendezvous.idCoiffeur', '=', 'Coiffeur.idCoiffeur')
      .where('Coiffeur.email', unEmail)
      .then(rows => {
        resolve(rows);
      })
      .catch(err => {

        reject(err);
      });
  });
}

/*login */

// Route POST pour se login en Coiffeur
app.post("/loginCoiffeur", async (req, res) => {
  try {
    const { unEmail, password } = req.body;

    const email = await getUserByUsername(unEmail);

    //si l'utilisateur existe pas on peut pas le LOGIN
    if (!email) {
      return res.status(400).json({ message: "Username/Passowrd invalide" }); //return quitte la route, le serveur retourne toujours 1 reponse
    }

    //on verifie si false que son mot de passe decrypter = a ce quil a ecrit
    if (!bcrypt.compare(password, email.password)) {
      return res.status(400).json({ message: "Username/Password unvalide" });
    }

    // initialiser token
    const token = jwt.sign({ email }, TOKEN_SECRET_KEY, { expiresIn: 3600 });

    res
      .status(200)
      .json({ message: "Connexion reussie.", token, expireDans: 3600 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la connexionde lutilisateur",
    });
  }
});

function getUserByUsername(unEmail) {
  return new Promise((resolve, reject) => {
    //on retourne une promesse au await
    db("Coiffeur")
      .select("*")
      .from("Coiffeur")
      .where("email", unEmail)
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject();
      });
  });
}

/*register */

/* route pour s'enregistrer*/
app.post('/registerCoiffeur', async (req, res) => {
  try {
    const { unEmail, nom, prenom, numeroTelephone, password } = req.body;

    const email = await getUserByUsername(unEmail);

    //si l'utilisateur existe deja grace a la fonction getUserByUsername
    if (email) {
      return res
        .status(400)
        .json({ message: "Cette utilisateur existe déjâ." }); //return quitte la route, le serveur retourne toujours 1 reponse
    }

    const passwordHashed = await bcrypt.hash(password, 10); //hach pour hacher mot de passe deuxieme param cpr le niveau diteration de hachage

    await insertUser(email, nom, prenom, numeroTelephone, passwordHashed);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des données.",
    });
  }
});

function getUserByUsername(unEmail) {
  return new Promise((resolve, reject) => {
    //on retourne une promesse au await
    db.select("*")
      .from("Coiffeur")
      .where("email", unEmail)
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject();
      });
  });
}

function insertUser(email, nom, prenom, numeroTelephone, passwordHashed) {
  return new Promise((resolve, reject) => {
    //on retourne une promesse au await
    db("Coiffeur")
      .insert({
        email: email,
        nomCoiffeur: nom,
        prenomCoiffeur: prenom,
        numCoiffeur: numeroTelephone,
        password: passwordHashed,
      })
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject();
      });
  });
}


// -------------------------- client ---------------------------------------------------
//rendez vous coté client
app.get("/rendezVousClient", authentification, async (req, res) => {
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



// Port d'écoute du serveur
app.listen(3000, () => {
  console.log(`Serveur démarré sur le port ${3000}`);
});

