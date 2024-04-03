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
const tokenModule = require('./token.js');


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

    const emailExiste = await getUserByUsername(email);

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

function getUserByUsername(unEmail) {
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
      return res.status(400).json({ message: "Username/Passowrd invalide" }); //return quitte la route, le serveur retourne toujours 1 reponse
    }

  // Vérifier si l'utilisateur a déjà un token valide, puis lui redonner son token s'il existe
    const tokenExistant = tokenModule.getTokenByUsername(username);
    if (tokenExistant && tokenModule.verifierToken(tokenExistant)) {
        return res.status(200).json({ message: 'Vous êtes déjà connecté.', token: tokenExistant ,expireDans: 3600});
    }
    
    //on verifie si false que son mot de passe decrypter = a ce quil a ecrit
    //compare retourne une PROMESSE DONC ATTENDRE LA FIN DE LA PROMESSE

    const promesseMdp= await bcrypt.compare(password, email.password);

    if (!promesseMdp){
        return res.status(400).json({message: 'Username ou Password unvalide'});
      }

    // initialiser token
    const token = jwt.sign({ email }, TOKEN_SECRET_KEY, { expiresIn: 3600 });

    
    // Stocker le token dans le module token
    tokenModule.modifierToken(username, token);

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
    const services = await getServicesForCoiffeur(unEmail);
    res.json({ services: services, message: 'Liste des services pour le coiffeur ' + req.user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des services.' });
  }
});

// Fonction :  obtenir les services d'un coiffeur
function getServicesForCoiffeur(unEmail) {
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

// DELETE: Supprimer un service
router.delete('/services', authentification, async (req, res) => {
  try {
    const { idService } = req.body; // Récupérer l'idService depuis le corps de la requête
    // Vérifier si le service existe
    const service = await db('Service').where('idService', idService).first();
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    // Supprimer le service de la table de jointure
    await db('Coiffeur_Service').where('idService', idService).del();
    // Supprimer le service de la table Service
    await db('Service').where('idService', idService).del();
    res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du service' });
  }
});


//Post: ajouter un Service pour un coiffeur
router.post('/services', authentification, async (req, res) => {
  try {
    const { nom, description } = req.body;
    // Insérer le service dans la table Service
    const [idService] = await db('Service').insert({ nom, description });
    // Associer le service au coiffeur actuel (celui qui a créé le service)
    const idCoiffeur = req.user; // Email de l'utilisateur extrait du token
    await db('Coiffeur_Service').insert({ idCoiffeur, idService });
    res.status(201).json({ message: 'Service ajouté avec succès', idService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'ajout du service' });
  }
});


// GET: Obtenir les disponibilités d'un coiffeur a l'aide de son email
router.get('/disponibilites', authentification, async (req, res) => {
  try {
    const unEmail = req.user; // Email de l'utilisateur extrait du token
    const disponibilites = await getDisponibilitesForCoiffeur(unEmail);
    res.json({ disponibilites: disponibilites, message: 'Liste des disponibilités pour le coiffeur ' + req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des disponibilités.' });
  }
});

// Fonction:  obtenir les disponibilités d'un coiffeur
function getDisponibilitesForCoiffeur(unEmail) {
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