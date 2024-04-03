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

const authentification = require('./authentification');
const router= express.Router();
// token.js pour stocker et invalider le token dans logout, ou le retourner dynamiquement
const tokenModule = require('./token');


/* ------------------------
 * Définition des routes
 * ------------------------ */

/* ------------------------
 *       COTÉ COIFFEUR
 * ------------------------ */

/* ====== REGISTER ET CONNEXION ======*/

//POST : REGISTER

router.post('/registerCoiffeur', async (req, res) => {
  try {
    const { email, nomCoiffeur, prenomCoiffeur, numCoiffeur, password , idSalon} = req.body;

    const emailExiste = await getUserByEmail(email);

    if (emailExiste) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur existe déjà." });
    }

    const passwordHashed = await bcrypt.hash(password, 10); 

    await insertUser(email,nomCoiffeur, prenomCoiffeur, numCoiffeur, passwordHashed, idSalon);

    res.status(200).json({ message: "Utilisateur enregistré avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de l'enregistrement de l'utilisateur.",
    });
  }
});

function getUserByEmail(unEmail) {
  return new Promise((resolve, reject) => {
    db.select("*").from("Coiffeur").where("email", unEmail).first()
      .then((row) => {
          resolve(row);
      })
      .catch(err => {
            reject();
      });
    })
}

function insertUser(email, nom, prenom, numeroTelephone, passwordHashed,idSalon) {
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
        return res.status(200).json({ message: 'Vous êtes déjà connecté.', token: tokenExistant ,expireDans: 3600});
    }
    
    //on verifie si false que son mot de passe decrypter = a ce quil a ecrit
    //compare retourne une PROMESSE DONC ATTENDRE LA FIN DE LA PROMESSE

    const promesseMdp = await bcrypt.compare(password, emailExistant.password);

    if (!promesseMdp){
        return res.status(400).json({message: 'Email ou Password unvalide'});
      }

    // initialiser token
    const token = jwt.sign({ email }, TOKEN_SECRET_KEY, { expiresIn: 3600 });

    
    // Stocker le token dans le module token
    tokenModule.modifierToken(email, token);

    res.status(200).json({ message: "Connexion reussie.", token, expireDans: 3600 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la connexionde lutilisateur",
    });
  }
});

function getUserByEmail(unEmail) {
  return new Promise((resolve, reject) => {
    //on retourne une promesse au await
    db("Coiffeur").select("*").from("Coiffeur").where("email", unEmail).first()
      .then((row) => {
        resolve(row);
      })
      .catch((err) => {
        reject();
      });
  });
}





//GET : Afficher les rendezvous d'un coiffeur
router.get('/rendezVousCoiffeur', authentification, async (req, res) => {
  try {
      const unEmail = req.user; // Email de l'utilisateur extrait du token
      const rendezVous = await rendezvousCoiffeur(unEmail);
      res.json({ rendezVous: rendezVous, message: 'Bienvenue dans le board sécurisé ' + req.user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des rendez-vous.' });
  }
});

//Function: affiche rendez vous d'un coiffeur
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

// GET: Obtenir les services d'un coiffeur
router.get('/services', authentification, async (req, res) => {
  try {
    const unEmail = req.user.email; // Email de l'utilisateur extrait du token
    const services = await servicesCoiffeur(unEmail);
    res.json({ services: services, message: 'Liste des services pour le coiffeur ' + req.user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des services.' });
  }
});

// Fonction :  obtenir les services d'un coiffeur
function servicesCoiffeur(unEmail) {
  return new Promise((resolve, reject) => {
    db.select('Service.*')
      .from('Service')
      .join('Coiffeur_Service', 'Service.idService', '=', 'Coiffeur_Service.idService')
      .join('Coiffeur', 'Coiffeur_Service.idCoiffeur', '=', 'Coiffeur.idCoiffeur')
      .where('Coiffeur.email', unEmail)
      .then(rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
}


// POST: Ajouter un service pour un coiffeur
router.post('/services', authentification,async (req, res) => {
  try {
    const { nom, description } = req.body;
    const idCoiffeur = await getCoiffeurByEmail(req.user.email); // Obtenez l'ID du coiffeur à partir de l'e-mail de l'utilisateur connecté

    if (!idCoiffeur) {
      return res.status(404).json({ message: "Coiffeur non trouvé." });
    }

    // Insérer le nouveau service et le lier au coiffeur
    const idService = await insererService(nom, description, idCoiffeur);

    res.status(201).json({ message: "Service ajouté avec succès.", idService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du service." });
  }
});

// Fonction: récupérer l'ID du coiffeur à partir de l'e-mail
async function getCoiffeurByEmail(email) {
  try {
    const coiffeur = await db('Coiffeur').select('idCoiffeur').where('email', email).first();
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
      const [idService] = await transaction('Service').insert({ nom, description, idCoiffeur });

      // Insérer la liaison entre le coiffeur et le service dans la table Coiffeur_Service
      await transaction('Coiffeur_Service').insert({ idCoiffeur, idService });

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
router.delete('/services', async (req, res) => {
  try {
    const { idService } = req.body;

    if (!idService) {
      return res.status(400).json({ message: "ID du service manquant dans le corps de la requête." });
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
    res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du service." });
  }
});

// Fonction: pour supprimer un service
async function supprimerService(idService) {
  try {
    // Commencez une transaction
    const transaction = await db.transaction();

    try {
      // Supprimer l'entrée correspondante dans la table Coiffeur_Service
      await transaction('Coiffeur_Service').where('idService', idService).del();

      // Supprimer l'entrée correspondante dans la table Service
      await transaction('Service').where('idService', idService).del();

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





// GET: Obtenir les disponibilités d'un coiffeur a l'aide de son email
router.get('/disponibilites', authentification, async (req, res) => {
  try {
    const unEmail = req.user; // Email de l'utilisateur extrait du token
    const disponibilites = await getDisponibilites(unEmail);
    res.json({ disponibilites: disponibilites, message: 'Liste des disponibilités pour le coiffeur ' + req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des disponibilités.' });
  }
});

// Fonction:  obtenir les disponibilités d'un coiffeur
function getDisponibilites(unEmail) {
  return new Promise((resolve, reject) => {
    db.select('Disponibilite.*')
      .from('Disponibilite')
      .join('Coiffeur_Disponibilite', 'Disponibilite.idDisponibilite', '=', 'Coiffeur_Disponibilite.idDisponibilite')
      .join('Coiffeur', 'Coiffeur_Disponibilite.idCoiffeur', '=', 'Coiffeur.idCoiffeur')
      .where('Coiffeur.email', unEmail)
      .then(rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// DELETE: Supprimer une disponibilité
router.delete('/disponibilites', authentification, async (req, res) => {
  try {
    const { idDisponibilite } = req.body; // Récupérer l'idDisponibilite depuis le corps de la requête
    // Vérifier si la disponibilité existe
    const disponibilite = await db('Disponibilite').where('idDisponibilite', idDisponibilite).first();
    if (!disponibilite) {
      return res.status(404).json({ message: 'Disponibilité non trouvée' });
    }
    // Supprimer la disponibilité de la table de jointure
    await db('Coiffeur_Disponibilite').where('idDisponibilite', idDisponibilite).del();
    // Supprimer la disponibilité de la table Disponibilite
    await db('Disponibilite').where('idDisponibilite', idDisponibilite).del();
    res.json({ message: 'Disponibilité supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de la disponibilité' });
  }
});



// POST: Ajouter une disponibilité
router.post('/disponibilites', authentification, async (req, res) => {
  try {
    const { dateDisponibilite, heureDisponibilite, idCoiffeur } = req.body; // Récupérer les données depuis le corps de la requête
    const idDisponibilite = await addDisponibilite(dateDisponibilite, heureDisponibilite);
    await db('Coiffeur_Disponibilite').insert({ idCoiffeur, idDisponibilite });
    res.status(201).json({ message: 'Disponibilité ajoutée avec succès', idDisponibilite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'ajout de la disponibilité' });
  }
});

// Fonction pour ajouter une disponibilité
function addDisponibilite(dateDisponibilite, heureDisponibilite) {
  return new Promise((resolve, reject) => {
    db('Disponibilite').insert({ dateDisponibilite, heureDisponibilite })
      .then(ids => {
        resolve(ids[0]); // Retourne l'ID de la disponibilité ajoutée
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports= router;