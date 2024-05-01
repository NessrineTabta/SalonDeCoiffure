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

    if (emailExiste) {
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

function getUserByUsername(email) {
  return new Promise((resolve, reject) => {
    db.select("*")
      .from("Client")
      .where("email", email)
      .first()
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function insertUser(email, nom, prenom, numeroTelephone, passwordHashed) {
  return new Promise((resolve, reject) => {
    db("Client")
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
    const { email, password } = req.body;
    console.log(password);

    const user = await getUserByUsername(email);
    console.log(user);

    //si l'utilisateur existe pas on peut pas le LOGIN
    if (!user) {
      return res.status(400).json({ message: "Username/Password invalide 1 " }); //return quitte la route, le serveur retourne toujours 1 reponse
    }

    //on verifie si false que son mot de passe decrypter = a ce quil a ecrit
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Username/Password invalide 2 " });
    }

    // initialiser token
    const token = jwt.sign(
      { id: user.idClient, email: user.email },
      TOKEN_SECRET_KEY,
      { expiresIn: 3600 }
    );

    res
      .status(200)
      .json({ message: "Connexion réussie.", token, expireDans: 3600 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la connexion de l'utilisateur.",
    });
  }
});
function getUserByUsername(email) {
  return new Promise((resolve, reject) => {
    //on retourne une promesse au await
    db("Client")
      .select("*")
      .from("Client")
      .where("email", email)
      .first()
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject();
      });
  });
}

// GET: Obtenir les détails d'un client par son ID
router.get("/client/:idClient", async (req, res) => {
  try {
    const idClient = req.params.idClient;
    const client = await db("Client")
      .select("nomClient", "prenomClient")
      .where("idClient", idClient)
      .first();
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }
    res.json(client);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des détails du client.",
    });
  }
});

// POST: Create a new Rendezvous
router.post("/Rendezvous", authentification, async (req, res) => {
  try {
    const clientEmail = req.user.email;
    const { dateRendezvous, heureRendezvous, idCoiffeur } = req.body;
    // Fetch the client ID based on the email
    const client = await db("Client").where("email", clientEmail).first();
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    const [idRendezvous] = await db("Rendezvous").insert({
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
// afficher tous les rendez-vous dun client
router.post("/rendezVousClients", authentification, async (req, res) => {
  try {
    const email = req.user.email; // Email de l'utilisateur extrait du token
    const client = await db("Client").where("email", email).first(); // Récupérer les infos du client
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }
    const rendezVous = await db.select("idRendezvous", "dateRendezvous", "heureRendezvous")
      .from("Rendezvous")
      .where("idClient", client.idClient); // Récupérer les rendez-vous du client
    res.json(rendezVous);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des rendez-vous.",
    });
  }
});

// GET: Obtenir tous les rendez-vous d'un client
router.get("/Rendezvous", authentification, async (req, res) => {
  try {
    const clientEmail = req.user.email; // Email du client extrait du token
    const Rendezvous = await getClientRendezvous(clientEmail);
    res.json({
      Rendezvous: Rendezvous,
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
    db.select("Rendezvous.*", "Coiffeur.nomCoiffeur", "Coiffeur.prenomCoiffeur")
      .from("Rendezvous")
      .join("Client", "Rendezvous.idClient", "=", "Client.idClient")
      .join("Coiffeur", "Rendezvous.idCoiffeur", "=", "Coiffeur.idCoiffeur")
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
router.delete("/RendezVous/:idRendezvous", authentification, async (req, res) => {
  try {
    const idRendezvous = req.params.idRendezvous; // Récupérer id par url

    // verifier si le rendez-vous existe
    const Rendezvous = await db("Rendezvous")
      .where("idRendezvous", idRendezvous)
      .first();
    if (!Rendezvous) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    // supprimer le rendez-vous de la table Rendezvous
    await db("Rendezvous").where("idRendezvous", idRendezvous).del();
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
router.put("/Rendezvous/:idRendezvous", authentification, async (req, res) => {
  const { idRendezvous } = req.params; // ID du rendez-vous à modifier
  const clientEmail = req.user.email.email; // Email du client extrait du token
  const { dateRendezvous, heureRendezvous, idCoiffeur } = req.body; // Nouvelles données pour le rendez-vous

  try {
    // Vérifier si le client existe
    const client = await db("Client").where("email", clientEmail).first();
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    // Vérifier si le rendez-vous appartient au client
    const Rendezvous = await db("Rendezvous")
      .where({
        idRendezvous,
        idClient: client.idClient,
      })
      .first();

    if (!Rendezvous) {
      return res.status(404).json({
        message:
          "Rendez-vous non trouvé ou vous n'avez pas la permission de le modifier.",
      });
    }

    // Modifier le rendez-vous
    await db("Rendezvous").where("idRendezvous", idRendezvous).update({
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

// GET: AFFICHER TOUT LES AVIS
router.get("/avis", async (req, res) => {
  db.select("*")
    .from("Avis")
    .then((avis) => {
      res.json(avis);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des avis :", err);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des avis" });
    });
});

// POST: CREER UN AVIS
router.post("/avis", authentification, async (req, res) => {
  console.log(req.body);
  const nombreEtoile = req.body.nombreEtoile.nombreEtoile;
  const description = req.body.description.description;
  const idSalon = req.body.idSalon.salonId;
  const clientEmail = req.user.email;

  try {
    // Obtenir l'ID du client à partir de son email
    const client = await getUserByUsername(clientEmail);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
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
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la création de l'avis pour le salon.",
    });
  }
});

// DELETE: Supprimer un avis
router.delete("/avis/:idAvis", authentification, async (req, res) => {
  const { idAvis } = req.params; // ID de l'avis à supprimer
  const clientEmail = req.user.email.email; // Email du client extrait du token JWT

  try {
    // Obtenir l'ID du client à partir de son email pour vérifier qu'il possède l'avis
    const client = await getUserByUsername(clientEmail);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    // Vérifier que l'avis appartient au client avant de le supprimer
    const avis = await db("Avis")
      .where({
        idAvis,
        idClient: client.idClient,
      })
      .first();

    if (!avis) {
      return res.status(404).json({
        message:
          "Avis non trouvé ou vous n'avez pas la permission de supprimer cet avis.",
      });
    }

    // Supprimer l'avis
    await db("Avis").where("idAvis", idAvis).del();

    res.json({ message: "Avis supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression de l'avis.",
    });
  }
});
// Route pour créer un salon
router.post("/salon", async (req, res) => {
  const { nomSalon, adresseSalon, emailSalon, numSalon } = req.body;

  // Validation des données entrantes
  if (!nomSalon || !adresseSalon || !emailSalon || !numSalon) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    //inserer le salon

    const [idSalon] = await db("Salon").insert({
      nomSalon,
      adresseSalon,
      emailSalon,
      numSalon,
    });

    res.status(201).json({
      message: "Salon créé avec succès.",
      idSalon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création du salon.",
    });
  }
});

// GET: Obtenir un salon par son ID à partir du corps de la requête
router.get("/salon", async (req, res) => {
  try {
    const { id } = req.body;

    // Vérifier si l'ID du salon est présent dans le corps de la requête
    if (!id) {
      return res.status(400).json({
        message: "L'ID du salon est requis dans le corps de la requête.",
      });
    }

    // Requête pour obtenir le salon par son ID
    const salon = await db("Salon")
      .select("nomSalon")
      .where("idSalon", id)
      .first();

    // Vérifier si le salon existe
    if (!salon) {
      return res.status(404).json({ message: "Salon non trouvé." });
    }

    res.status(200).json({ nomSalon: salon.nomSalon });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération du salon.",
    });
  }
});

  // GET: Route pour récupérer TOUT les salons disponibles POUR BERIVAN
// GET: Noms des salons disponibles
router.get("/nomsSalons", async (req, res) => {
  try {
    const nomsSalons = await getNomsSalons();
    res.status(200).json(nomsSalons);
  } catch (error) {
    console.error("Une erreur s'est produite:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des noms de salons." });
  }
});

// Fonction: obtenir les noms de tous les salons
function getNomsSalons() {
  return new Promise((resolve, reject) => {
    db.select("idSalon", "nomSalon")
      .from("Salon")
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
}


module.exports = router;
