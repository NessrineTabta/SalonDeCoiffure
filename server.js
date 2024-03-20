/* ------------------------
 * Définition des variables
 * ------------------------ */

//POUR BASE DE DONNEE ET REQUETE
const db = require('./db');

//les routes
const loginRouter = require('./login'); 
const registerRouter = require('./register'); 
const authRouter = require('./auth'); 


var express = require('express');
var app = express();
const bodyparser= require('body-parser'); //pour body
app.use(express.json()); //pour json
app.use(bodyparser.json()); //pour json


//pour les tokens
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TOKEN_SECRET_KEY= 'WEB_4D2_00003'                  //ajout de chaine pour completer le sign token


/* ------------------------
 * Définition des routes
 * ------------------------ */

function authentification(req, res, next) {
  const token = req.body.token;
  if (!token) {
      return res.status(400).json({ message: 'Accès non autorisé' }); // Vérifiez l'orthographe de "message"
  }

  jwt.verify(token, TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
          return res.status(400).json({ message: 'Token invalide' }); // Vérifiez l'orthographe de "message"
      }
      req.user = user;
      next(); // va executer le prochain code
  });
}

app.get('/dashboard', authentification, (req, res) => {
  res.json({ message: 'Bienvenue dans le board sécurisé ' + req.user.username }); // Vérifiez l'orthographe de "message"
});

/*login */


// Route GET pour se login
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      
      const user = await getUserByUsername(username);

      //si l'utilisateur existe pas on peut pas le LOGIN
      if(!user){
          return res.status(400).json({message: 'Username/Passowrd invalide'}); //return quitte la route, le serveur retourne toujours 1 reponse
      }

      //on verifie si false que son mot de passe decrypter = a ce quil a ecrit
      if( !(bcrypt.compare(password, user.password) )){
          return res.status(400).json({message: 'Username/Password unvalide'});
      }

      // initialiser token
      const token = jwt.sign({username}, TOKEN_SECRET_KEY, {expiresIn: 3600})

      res.status(200).json({message: 'Connexion reussie.', token, expireDans: 3600})
      

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de la connexionde lutilisateur' });
  }
});

function getUserByUsername(username){
  return new Promise((resolve,reject) => {                         //on retourne une promesse au await
      db('users').select('*').from('users').where('username', username)
      .then(row => {
          resolve(row);
      })
      .catch(err => {
        reject();
      });
        })                              
}

/*register */

/* route pour s'enregistrer*/
app.post('/register', async (req, res) => {
  try {

      const { username, email, password } = req.body;

      const user = await getUserByUsername(username);

      //si l'utilisateur existe deja grace a la fonction getUserByUsername
      if(user){
          return res.status(400).json({message: 'Cette utilisateur existe déjâ.'}); //return quitte la route, le serveur retourne toujours 1 reponse
      }

      const passwordHashed= await bcrypt.hash(password, 10); //hach pour hacher mot de passe deuxieme param cpr le niveau diteration de hachage


      await insertUser(username, email, passwordHashed)
      

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des données.' });
  }
});

function getUserByUsername(username){
  return new Promise((resolve,reject) => {                         //on retourne une promesse au await
      db.select('*').from('users').where('username', username)
      .then(row => {
          resolve(row);
      })
      .catch(err => {
        reject();
      });
        })                              
}

function insertUser(username, email, passwordHashed){
  return new Promise((resolve,reject) => {                         //on retourne une promesse au await
      db('users').insert({
          username: username,
          email: email,
          password: passwordHashed,
      })
      .then(row => {
          resolve(row);
      })
      .catch(err => {
        reject();
      });
        })                              
}


// Port d'écoute du serveur
app.listen(3000, () => {
    console.log(`Serveur démarré sur le port ${3000}`);
});

