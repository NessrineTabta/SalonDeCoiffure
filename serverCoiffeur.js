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
// token.js pour stocker et invalider le token dans logout, ou le retourner dynamiquement
const tokenModule = require("./token");

/* stock image portfolio */
const multer = require("multer");
const path = require("path");

// Multer pour le stockage des images téléchargées
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Le répertoire où stocker les images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

/* ------------------------
 * Définition des routes
 * ------------------------ */

/* ------------------------
 *       COTÉ COIFFEUR
 * ------------------------ */

/* ====== REGISTER ET CONNEXION ======*/

//POST : REGISTER

router.post("/registerCoiffeur", async (req, res) => {
  try {
    const {
      email,
      nomCoiffeur,
      prenomCoiffeur,
      numCoiffeur,
      password,
      idSalon,
    } = req.body;

    const emailExiste = await getUserByEmail(email);

    if (emailExiste) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    await insertUser(
      email,
      nomCoiffeur,
      prenomCoiffeur,
      numCoiffeur,
      passwordHashed,
      idSalon
    );

    res.status(200).json({ message: "Utilisateur enregistré avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de l'enregistrement de l'utilisateur.",
    });
  }
});

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.select("*")
      .from("Coiffeur")
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

function insertUser(
  email,
  nom,
  prenom,
  numeroTelephone,
  passwordHashed,
  idSalon
) {
  return new Promise((resolve, reject) => {
    db("Coiffeur")
      .insert({
        email: email,
        nomCoiffeur: nom,
        prenomCoiffeur: prenom,
        numCoiffeur: numeroTelephone,
        password: passwordHashed,
        idSalon: idSalon,
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
router.post("/loginCoiffeur", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailExistant = await getUserByEmail(email);

    //si l'utilisateur existe pas on peut pas le LOGIN
    if (!emailExistant) {
      return res.status(400).json({ message: "Email/Passowrd invalide" }); //return quitte la route, le serveur retourne toujours 1 reponse
    }

    // Vérifier si l'utilisateur a déjà un token valide, puis lui redonner son token s'il existe
    const tokenExistant = tokenModule.getTokenByUsername(email);
    if (tokenExistant && tokenModule.verifierToken(tokenExistant)) {
      return res.status(200).json({
        message: "Vous êtes déjà connecté.",
        token: tokenExistant,
        expireDans: 3600,
      });
    }

    //on verifie si false que son mot de passe decrypter = a ce quil a ecrit
    //compare retourne une PROMESSE DONC ATTENDRE LA FIN DE LA PROMESSE

    const promesseMdp = await bcrypt.compare(password, emailExistant.password);

    if (!promesseMdp) {
      return res.status(400).json({ message: "Email ou Password unvalide" });
    }

    // initialiser token
    const token = jwt.sign({ email }, TOKEN_SECRET_KEY, { expiresIn: 3600 });

    // Stocker le token dans le module token
    tokenModule.modifierToken(email, token);

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

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    //on retourne une promesse au await
    db("Coiffeur")
      .select("*")
      .from("Coiffeur")
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

// GET: Route pour vérifier le type d'utilisateur
router.get("/verifierTypeUtilisateur", authentification, async (req, res) => {
  try {
    const email = req.user.email;

    // Vérification dans la table Coiffeur
    const coiffeur = await db("Coiffeur").where("email", email).first();
    if (coiffeur) {
      return res.status(200).json({ isCoiffeur: true });
    }

    // Vérification dans la table Client
    const client = await db("Client").where("email", email).first();
    if (client) {
      return res.status(200).json({ isCoiffeur: false });
    }

    // Si l'utilisateur n'est ni un coiffeur ni un client
    return res.status(404).json({ message: "Type d'utilisateur inconnu" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la vérification du type d'utilisateur",
    });
  }
});

// GET: Route to get coiffeurs by salon ID
router.get("/coiffeursParSalon/:idSalon", async (req, res) => {
  try {
    const { idSalon } = req.params; // Extracting idSalon from the request parameters
    // Query to select coiffeurs where `idSalon` matches the provided ID
    const coiffeurs = await db
      .select("*")
      .from("Coiffeur")
      .where("idSalon", idSalon);
    res.status(200).json(coiffeurs);
  } catch (error) {
    console.error("Une erreur s'est produite:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des coiffeurs." });
  }
});

// GET: Obtenir tous les coiffeurs
router.get("/coiffeurs", async (req, res) => {
  try {
    // Récupérer tous les coiffeurs depuis la base de données
    const allCoiffeurs = await db.select().from("Coiffeur");

    res.json({
      coiffeurs: allCoiffeurs,
      message: "Liste de tous les coiffeurs",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des coiffeurs.",
    });
  }
});

// POST: Modifier les informations du coiffeur
router.post("/coiffeurs", authentification, async (req, res) => {
  try {
    const { nomCoiffeur, prenomCoiffeur, numCoiffeur, password } = req.body;
    const idCoiffeur = await getIdByEmail(req.user.email); // Obtenez l'ID du coiffeur à partir de l'e-mail de l'utilisateur connecté

    if (!idCoiffeur) {
      return res.status(404).json({ message: "Coiffeur non trouvé." });
    }

    // Hasher le mot de passe
    const passwordHashed = await bcrypt.hash(password, 10);

    // Mettre à jour les informations du coiffeur
    await db("Coiffeur").where("idCoiffeur", idCoiffeur).update({
      nomCoiffeur,
      prenomCoiffeur,
      numCoiffeur,
      password: passwordHashed, // Mise à jour du mot de passe hashé
    });

    res
      .status(200)
      .json({ message: "Informations du coiffeur modifiées avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la modification des informations du coiffeur.",
    });
  }
});

//POST : Afficher les rendezvous d'un coiffeur
router.post("/rendezVousCoiffeur", authentification, async (req, res) => {
  try {
    const email = req.user.email; // Email de l'utilisateur extrait du token
    const idCoiffeur = await getIdByEmail(email); // Correction : Récupération de l'identifiant du coiffeur
    const rendezVous = await rendezvousCoiffeur(idCoiffeur);
    res.json(rendezVous); // Correction : Retourne directement les rendez-vous
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des rendez-vous.",
    });
  }
});
//Function: affiche rendez vous d'un coiffeur
async function rendezvousCoiffeur(idCoiffeur) {
  // Correction : Ajout de l'async pour permettre l'attente de la requête
  try {
    const rendezVous = await db
      .select("idRendezvous", "dateRendezvous", "heureRendezvous") // Correction : Ajout de l'identifiant du rendez-vous
      .from("Rendezvous")
      .where("idCoiffeur", idCoiffeur);
    return rendezVous; // Correction : Retourne directement les rendez-vous
  } catch (error) {
    throw error;
  }
}

// GET: Obtenir les services d'un coiffeur
router.get("/services", authentification, async (req, res) => {
  try {
    const email = req.user.email; // Email de l'utilisateur extrait du token
    const services = await servicesCoiffeur(email);
    res.json({
      services: services,
      message: "Liste des services pour le coiffeur " + req.user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des services.",
    });
  }
});

// Fonction :  obtenir les services d'un coiffeur
function servicesCoiffeur(email) {
  return new Promise((resolve, reject) => {
    db.select("Service.*")
      .from("Service")
      .join(
        "Coiffeur_Service",
        "Service.idService",
        "=",
        "Coiffeur_Service.idService"
      )
      .join(
        "Coiffeur",
        "Coiffeur_Service.idCoiffeur",
        "=",
        "Coiffeur.idCoiffeur"
      )
      .where("Coiffeur.email", email)
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// GET: Services d'un coiffeur
router.get("/servicess/:idCoiffeur", async (req, res) => {
  const { idCoiffeur } = req.params;
  try {
    const services = await db
      .select("Service.*")
      .from("Service")
      .join(
        "Coiffeur_Service",
        "Service.idService",
        "=",
        "Coiffeur_Service.idService"
      )
      .where("Coiffeur_Service.idCoiffeur", idCoiffeur);

    if (services.length > 0) {
      res.status(200).json(services);
    } else {
      res
        .status(404)
        .json({ message: "Aucun service trouvé pour ce coiffeur." });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des services du coiffeur :",
      error
    );
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des services.",
    });
  }
});

// GET: Obtenir tous les Coiffeur_Service
router.get("/showCoiffeur_Service", async (req, res) => {
  try {
    // Récupérer tous les services depuis la base de données
    const allServices = await db.select().from("Coiffeur_Service");

    res.json({
      services: allServices,
      message: "Liste de tous les services",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des Coiffeur_services.",
    });
  }
});

// GET: Obtenir tous les services de tous les coiffeurs depuis la base de données
router.get("/tousservices", async (req, res) => {
  try {
    // Utilisation de Knex.js pour effectuer une jointure pour récupérer tous les services avec les informations du coiffeur associé
    const allServices = await db
      .select("Service.*")
      .from("Service")
      .join(
        "Coiffeur_Service",
        "Service.idService",
        "=",
        "Coiffeur_Service.idService"
      )
      .join(
        "Coiffeur",
        "Coiffeur_Service.idCoiffeur",
        "=",
        "Coiffeur.idCoiffeur"
      );

    res.json({
      services: allServices,
      message: "Liste de tous les services de tous les coiffeurs",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des services.",
    });
  }
});

// GET: Obtenir tous les services
router.get("/showServices", async (req, res) => {
  try {
    // Récupérer tous les services depuis la base de données
    const allServices = await db.select().from("Service");

    res.json({
      services: allServices,
      message: "Liste de tous les services",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des services.",
    });
  }
});

// POST: service
router.post("/services", authentification, async (req, res) => {
  try {
    const { nom, description } = req.body;
    const idCoiffeur = await getIdByEmail(req.user.email); // Obtenez l'ID du coiffeur à partir de l'e-mail de l'utilisateur connecté

    if (!idCoiffeur) {
      return res.status(404).json({ message: "Coiffeur non trouvé." });
    }

    // Insérer le nouveau service et le lier au coiffeur
    const idService = await insererService(nom, description, idCoiffeur);

    res.status(201).json({ message: "Service ajouté avec succès.", idService });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de l'ajout du service.",
    });
  }
});

// POST: Ajouter une relation Coiffeur-Service
router.post("/CoiffeurService", authentification, async (req, res) => {
  try {
    const idCoiffeur = await getIdByEmail(req.user.email); // Obtenez l'ID du coiffeur à partir de l'e-mail de l'utilisateur connecté
    const { idService } = req.body;

    // Vérifier si les ID de coiffeur et de service sont fournis
    if (!idCoiffeur || !idService) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir l'ID du coiffeur et de service." });
    }

    // Insérer la relation Coiffeur-Service dans la table Coiffeur_Service
    await db("Coiffeur_Service").insert({ idCoiffeur, idService });

    res
      .status(201)
      .json({ message: "Relation Coiffeur_Service ajoutée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de l'ajout de la relation Coiffeur_Service.",
    });
  }
});

// Fonction: récupérer l'ID du coiffeur à partir de l'e-mail
async function getIdByEmail(email) {
  try {
    const coiffeur = await db("Coiffeur")
      .select("idCoiffeur")
      .where("email", email)
      .first();
    if (coiffeur) {
      return coiffeur.idCoiffeur;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

// Fonction: insérer un nouveau service et le lier au coiffeur
async function insererService(nom, description, idCoiffeur) {
  try {
    // Commencer une transaction
    const transaction = await db.transaction();

    try {
      // Insérer le nouveau service dans la table Service
      const [idService] = await transaction("Service").insert({
        nom,
        description,
        idCoiffeur,
      });

      // Insérer la liaison entre le coiffeur et le service dans la table Coiffeur_Service
      await transaction("Coiffeur_Service").insert({ idCoiffeur, idService });

      // Valider la transaction
      await transaction.commit();

      return idService;
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

// DELETE: Service
router.delete("/services", async (req, res) => {
  try {
    const { idService } = req.body;

    if (!idService) {
      return res.status(400).json({
        message: "ID du service manquant dans le corps de la requête.",
      });
    }

    // Supprimer le service
    const serviceSupprime = await supprimerService(idService);

    if (serviceSupprime) {
      res.status(200).json({ message: "Service supprimé avec succès." });
    } else {
      res.status(404).json({ message: "Service non trouvé." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression du service.",
    });
  }
});

// Fonction: pour supprimer un service
async function supprimerService(idService) {
  try {
    // Commencez une transaction
    const transaction = await db.transaction();

    try {
      // Supprimer l'entrée correspondante dans la table Coiffeur_Service
      await transaction("Coiffeur_Service").where("idService", idService).del();

      // Supprimer l'entrée correspondante dans la table Service
      await transaction("Service").where("idService", idService).del();

      // Valider la transaction
      await transaction.commit();

      return true; // Service supprimé avec succès
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

// DELETE: Supprimer une relation Coiffeur-Service
router.delete("/CoiffeurService", authentification, async (req, res) => {
  try {
    const { idCoiffeur_Service } = req.body; // Récupérer l'id de la relation Coiffeur-Service depuis le corps de la requête
    // Vérifier si la relation Coiffeur-Service existe
    const coiffeurService = await db("Coiffeur_Service")
      .where("idCoiffeur_Service", idCoiffeur_Service)
      .first();
    if (!coiffeurService) {
      return res
        .status(404)
        .json({ message: "Relation Coiffeur-Service non trouvée" });
    }
    // Supprimer la relation Coiffeur-Service
    await db("Coiffeur_Service")
      .where("idCoiffeur_Service", idCoiffeur_Service)
      .del();
    res.json({ message: "Relation Coiffeur-Service supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la suppression de la relation Coiffeur-Service",
    });
  }
});

// GET: Desponibilite
router.post("/afficherdisponibilites", authentification, async (req, res) => {
  try {
    const email = req.user.email; // Email de l'utilisateur extrait du token
    const disponibilites = await getDisponibilites(email);
    res.json({
      disponibilites: disponibilites,
      message: "Liste des disponibilités pour le coiffeur " + req.user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des disponibilités.",
    });
  }
});

// Fonction:  obtenir les disponibilités d'un coiffeur
function getDisponibilites(email) {
  return new Promise((resolve, reject) => {
    db.select("Disponibilite.*")
      .from("Disponibilite")
      .join(
        "Coiffeur_Disponibilite",
        "Disponibilite.idDisponibilite",
        "=",
        "Coiffeur_Disponibilite.idDisponibilite"
      )
      .join(
        "Coiffeur",
        "Coiffeur_Disponibilite.idCoiffeur",
        "=",
        "Coiffeur.idCoiffeur"
      )
      .where("Coiffeur.email", email)
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// POST: disponibilité
router.post("/disponibilites", authentification, async (req, res) => {
  try {
    const { dateDisponibilite, heureDisponibilite } = req.body;
    const idCoiffeur = await getIdByEmail(req.user.email);

    if (!idCoiffeur) {
      return res.status(404).json({ message: "Coiffeur non trouvé." });
    }

    // Vérifier s'il existe déjà une disponibilité pour la même date et heure
    const siExiste = await db("Disponibilite")
      .where({
        dateDisponibilite,
        heureDisponibilite,
        idCoiffeur
      })
      .first();

    if (siExiste) {
      return res.status(400).json({ message: "Cette disponibilité existe déjà." });
    }

    // Insérer le nouveau service et le lier au coiffeur
    const idDisponibilite = await insererDisponibilite(
      dateDisponibilite,
      heureDisponibilite,
      idCoiffeur
    );

    res.status(201).json({
      message: "Disponibilité ajoutée avec succès.",
      idDisponibilite
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de l'ajout de la disponibilité.",
    });
  }
});

async function insererDisponibilite(dateDisponibilite, heureDisponibilite, idCoiffeur) {
  try {
    const transaction = await db.transaction();

    try {
      const [idDisponibilite] = await transaction("Disponibilite").insert({
        dateDisponibilite,
        heureDisponibilite,
        idCoiffeur,
      });

      await transaction("Coiffeur_Disponibilite").insert({
        idCoiffeur,
        idDisponibilite,
      });

      await transaction.commit();

      return idDisponibilite;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

// GET: Disponibilités d'un coiffeur
router.get("/disponibilites", async (req, res) => {
  try {
    const { idCoiffeur, idSalon, idService } = req.query;

    let disponibilites;

    if (idCoiffeur) {
      disponibilites = await getCoiffeurDisponibilites(idCoiffeur);
    } else if (idSalon) {
      disponibilites = await getSalonDisponibilites(idSalon);
    } else if (idService) {
      disponibilites = await getServiceDisponibilites(idService);
    } else {
      return res.status(400).json({ message: "Please provide a valid id." });
    }

    res.json({ disponibilites: disponibilites });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des disponibilités.",
    });
  }
});

// Fonction: obtenir les disponibilités d'un coiffeur
function getCoiffeurDisponibilites(idCoiffeur) {
  return new Promise((resolve, reject) => {
      db.select(
          "Disponibilite.*",
          "Coiffeur.nomCoiffeur",
          "Salon.nomSalon"
      )
      .from("Disponibilite")
      .join(
          "Coiffeur_Disponibilite",
          "Disponibilite.idDisponibilite",
          "=",
          "Coiffeur_Disponibilite.idDisponibilite"
      )
      .join("Coiffeur", "Coiffeur_Disponibilite.idCoiffeur", "=", "Coiffeur.idCoiffeur")
      .join("Salon", "Coiffeur.idSalon", "=", "Salon.idSalon")
      .where("Coiffeur_Disponibilite.idCoiffeur", idCoiffeur)
      .then((rows) => {
          resolve(rows);
      })
      .catch((err) => {
          reject(err);
      });
  });
}

// Fonction: obtenir les disponibilités d'un salon
function getSalonDisponibilites(idSalon) {
  return new Promise((resolve, reject) => {
    db.select(
      "Disponibilite.*",
      "Coiffeur.nomCoiffeur",
      "Salon.nomSalon"
    )
    .from("Disponibilite")
    .join("Coiffeur", "Disponibilite.idCoiffeur", "=", "Coiffeur.idCoiffeur")
    .join(
      "Coiffeur_Disponibilite",
      "Disponibilite.idDisponibilite",
      "=",
      "Coiffeur_Disponibilite.idDisponibilite"
    )
    .join("Salon", "Coiffeur.idSalon", "=", "Salon.idSalon")
    .where("Coiffeur.idSalon", idSalon)
    .then((rows) => {
      resolve(rows);
    })
    .catch((err) => {
      reject(err);
    });
  });
}


// Fonction: obtenir les disponibilités d'un service
function getServiceDisponibilites(idService) {
  return new Promise((resolve, reject) => {
    db.select(
      "Disponibilite.*",
      "Coiffeur.nomCoiffeur",
      "Salon.nomSalon"
    )
    .from("Disponibilite")
    .join("Coiffeur", "Disponibilite.idCoiffeur", "=", "Coiffeur.idCoiffeur")
    .join(
      "Coiffeur_Disponibilite",
      "Disponibilite.idDisponibilite",
      "=",
      "Coiffeur_Disponibilite.idDisponibilite"
    )
    .join(
      "Coiffeur_Service",
      "Coiffeur.idCoiffeur",
      "=",
      "Coiffeur_Service.idCoiffeur"
    )
    .join("Salon", "Coiffeur.idSalon", "=", "Salon.idSalon")
    .where("Coiffeur_Service.idService", idService)
    .then((rows) => {
      resolve(rows);
    })
    .catch((err) => {
      reject(err);
    });
  });
}


// DELETE: Supprimer une disponibilité
router.delete("/disponibilites", authentification, async (req, res) => {
  try {
    const { idDisponibilite } = req.body; // Récupérer l'idDisponibilite depuis le corps de la requête
    // Vérifier si la disponibilité existe
    const disponibilite = await db("Disponibilite")
      .where("idDisponibilite", idDisponibilite)
      .first();
    if (!disponibilite) {
      return res.status(404).json({ message: "Disponibilité non trouvée" });
    }
    // Supprimer la disponibilité de la table de jointure
    await db("Coiffeur_Disponibilite")
      .where("idDisponibilite", idDisponibilite)
      .del();
    // Supprimer la disponibilité de la table Disponibilite
    await db("Disponibilite").where("idDisponibilite", idDisponibilite).del();
    res.json({ message: "Disponibilité supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la suppression de la disponibilité",
    });
  }
});

// Fonction:  obtenir les disponibilités d'un coiffeur
function getDisponibilites(email) {
  return new Promise((resolve, reject) => {
    db.select("Disponibilite.*")
      .from("Disponibilite")
      .join(
        "Coiffeur_Disponibilite",
        "Disponibilite.idDisponibilite",
        "=",
        "Coiffeur_Disponibilite.idDisponibilite"
      )
      .join(
        "Coiffeur",
        "Coiffeur_Disponibilite.idCoiffeur",
        "=",
        "Coiffeur.idCoiffeur"
      )
      .where("Coiffeur.email", email)
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// POST: Mettre à jour l'image du Portefeuille avec Multer
router.post(
  "/portfolio",
  authentification,
  upload.single("file"),
  async (req, res) => {
    try {
      const urlPhoto = req.body.urlPhoto; // Chemin du fichier téléversé par Multer
      const email = req.user.email;

      // Récupérer l'identifiant du coiffeur à partir de l'email
      const idCoiffeur = await getIdByEmail(email);

      // Insérer ou mettre à jour l'URL de l'image dans la base de données
      await db("Portfolio")
        .insert({
          urlPhoto: urlPhoto,
          idCoiffeur: idCoiffeur,
        })
        .onConflict("idCoiffeur")
        .merge();

      res
        .status(200)
        .json({ message: "Image du portfolio mise à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error:
          "Une erreur est survenue lors de la mise à jour de l'image du portfolio",
      });
    }
  }
);

// POST: Récupérer Image du portfolio
router.post("/recupererphoto", authentification, async (req, res) => {
  try {
    const email = req.user.email;
    const idCoiffeur = await getIdByEmail(email);
    const portfolio = await db("Portfolio")
      .select("urlPhoto")
      .where("idCoiffeur", idCoiffeur)
      .orderBy("idPortfolio", "desc")
      .first();
    if (portfolio) {
      res.json({ imageUrl: portfolio.urlPhoto });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération de la photo :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la photo." });
  }
});

// POST: Récupérer Image du portfolio
router.post("/recupererphoto/:email", authentification, async (req, res) => {
  try {
    const email = req.params.email;
    const idCoiffeur = await getIdByEmail(email);
    const portfolio = await db("Portfolio")
      .select("urlPhoto")
      .where("idCoiffeur", idCoiffeur)
      .orderBy("idPortfolio", "desc")
      .first();
    if (portfolio) {
      res.json({ imageUrl: portfolio.urlPhoto });
    } else {
      throw new Error("Aucune photo trouvée pour ce coiffeur");
    }
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération de la photo :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la photo." });
  }
});


//POST: Enregistrer les 3 images uploadé dans portfolio bio chacune leur tour
router.post(
  "/portfolioimages",
  authentification,
  upload.array("images", 3),
  async (req, res) => {
    const email = req.user.email;

    try {
      // Récupérer l'identifiant du coiffeur à partir de l'email
      const idCoiffeur = await getIdByEmail(email);

      // Vérifier si des fichiers ont été téléchargés
      if (req.files && req.files.length > 0) {
        // Parcourir chaque image téléchargée
        req.files.forEach(async (file) => {
          const imageUrl = "/uploads/" + file.filename; // URL de l'image
          // Insérer ou mettre à jour l'URL de l'image dans la base de données
          await db("Portfolio")
            .insert({
              urlPhoto: imageUrl,
              idCoiffeur: idCoiffeur,
            })
            .onConflict("idCoiffeur")
            .merge();
        });
      }

      res
        .status(200)
        .json({ message: "Images du portfolio mises à jour avec succès" });
    } catch (error) {}
  }
);

module.exports = router;