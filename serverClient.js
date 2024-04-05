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

/* ------------------------
 * Définition des routes
 * ------------------------ */

/* ------------------------
 *       COTÉ client
 * ------------------------ */

/* ====== REGISTER ET CONNEXION ======*/

//POST : REGISTER

router.post("/registerClient", async (req, res) => {
  try {
    const { email, nomClient, prenomClient, numClient, password } = req.body;

    const emailExiste = await getUserByUsername(email);

    if (!emailExiste) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    await insertUser(email, nomClient, prenomClient, numClient, passwordHashed);

    res.status(200).json({ message: "Utilisateur enregistré avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de l'enregistrement de l'utilisateur.",
    });
  }
});

function getUserByUsername(unEmail) {
  return new Promise((resolve, reject) => {
    db.select("*")
      .from("Client")
      .where("email", unEmail)
      .first()
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
    db("Client")
      // Création de la table Client
      // db.schema.createTable('Client', table => {
      //  table.increments('idClient').primary();
      // table.string('email').unique().notNullable();
      //  table.string('nomClient').notNullable();
      //   table.string('prenomClient').notNullable();
      //  table.integer('numClient').notNullable();
      //   table.string('password').unique().notNullable();
      // }).then(() => console.log('Table Client créée'));

      .insert({
        email: email,
        nomClient: nom,
        prenomClient: prenom,
        numClient: numeroTelephone,
        password: passwordHashed,
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//POST: LOGIN
router.post("/loginClient", async (req, res) => {
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
    db("Client")
      .select("*")
      .from("Client")
      .where("email", unEmail)
      .first()
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject();
      });
  });
}

// POST: Create a new rendezvous
router.post("/rendezvous", authentification, async (req, res) => {
  try {
    const clientEmail = req.user.email;
    const { dateRendezvous, heureRendezvous, idCoiffeur } = req.body;
    // Fetch the client ID based on the email
    const client = await db("Client").where("email", clientEmail).first();
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    const [idRendezvous] = await db("rendezvous").insert({
      dateRendezvous,
      heureRendezvous,
      idClient: client.idClient,
      idCoiffeur,
    });

    res
      .status(201)
      .json({ message: "Rendez-vous créé avec succès.", idRendezvous });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création du rendez-vous.",
    });
  }
});
// GET: Obtenir tous les rendez-vous d'un client
router.get("/rendezvous", authentification, async (req, res) => {
  try {
    const clientEmail = req.user.email; // Email du client extrait du token
    const rendezvous = await getClientRendezvous(clientEmail);
    res.json({
      rendezvous: rendezvous,
      message: "Liste des rendez-vous pour le client " + clientEmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des rendez-vous.",
    });
  }
});

// Fonction: obtenir tous les rendez-vous d'un client
function getClientRendezvous(clientEmail) {
  return new Promise((resolve, reject) => {
    db.select("rendezvous.*", "Coiffeur.nomCoiffeur", "Coiffeur.prenomCoiffeur")
      .from("rendezvous")
      .join("Client", "rendezvous.idClient", "=", "Client.idClient")
      .join("Coiffeur", "rendezvous.idCoiffeur", "=", "Coiffeur.idCoiffeur")
      .where("Client.email", clientEmail)
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// DELETE: Supprimer/Annuler un rendez-vous
router.delete("/rendezvous", authentification, async (req, res) => {
  try {
    const { idRendezvous } = req.body; // Récupérer l'idRendezvous depuis le corps de la requête

    // Vérifier si le rendez-vous existe
    const rendezvous = await db("rendezvous")
      .where("idRendezvous", idRendezvous)
      .first();
    if (!rendezvous) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    // Supprimer le rendez-vous de la table rendezvous
    await db("rendezvous").where("idRendezvous", idRendezvous).del();
    res.json({ message: "Rendez-vous supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la suppression du rendez-vous",
    });
  }
});

// PUT: Modifier un rendez-vous existant d'un client
router.put("/rendezvous/:idRendezvous", authentification, async (req, res) => {
  const { idRendezvous } = req.params; // ID du rendez-vous à modifier
  const clientEmail = req.user.email; // Email du client extrait du token
  const { dateRendezvous, heureRendezvous, idCoiffeur } = req.body; // Nouvelles données pour le rendez-vous

  try {
    // Vérifier si le client existe
    const client = await db("Client").where("email", clientEmail).first();
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    // Vérifier si le rendez-vous appartient au client
    const rendezvous = await db("rendezvous")
      .where({
        idRendezvous,
        idClient: client.idClient,
      })
      .first();

    if (!rendezvous) {
      return res.status(404).json({
        message:
          "Rendez-vous non trouvé ou vous n'avez pas la permission de le modifier.",
      });
    }

    // Modifier le rendez-vous
    await db("rendezvous").where("idRendezvous", idRendezvous).update({
      dateRendezvous,
      heureRendezvous,
      idCoiffeur,
    });

    res.json({ message: "Rendez-vous modifié avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la modification du rendez-vous.",
    });
  }
});

// Route pour get un salon par le nom
function getSalonByName(nomSalon) {
  return new Promise((resolve, reject) => {
    db("Salon")
      .where("nomSalon", "like", `%${nomSalon}%`)
      .first()
      .then((salon) => {
        if (salon) {
          resolve(salon.idSalon);
        } else {
          resolve(null); // Aucun salon trouvé avec ce nom
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// POST: CREER UN AVIS
router.post("/avis", authentification, async (req, res) => {
  const clientEmail = req.user.email; // Email du client extrait du token JWT pour l'authentification
  const { nombreEtoile, description, nomSalon } = req.body; // nomSalon est utilisé ici au lieu de idSalon

  try {
    // Obtenir l'ID du client à partir de son email
    const client = await getUserByUsername(clientEmail);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    // Obtenir l'ID du salon à partir de son nom
    const idSalon = await getSalonByName(nomSalon);
    if (!idSalon) {
      return res.status(404).json({ message: "Salon non trouvé." });
    }

    // Créer l'avis pour le salon
    const [idAvis] = await db("Avis").insert({
      nombreEtoile,
      description,
      idClient: client.idClient,
      idSalon,
    });

    res
      .status(201)
      .json({ message: "Avis créé avec succès pour le salon.", idAvis });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "Une erreur s'est produite lors de la création de l'avis pour le salon.",
      });
  }
});

module.exports = router;
