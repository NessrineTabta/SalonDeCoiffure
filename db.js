// constante demande les prérequis knex (la librairie db)
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './utilisateurs.sqlite3', // Le chemin vers votre fichier SQLite3
  },
  useNullAsDefault: true,
});

//Création de la table Utilisateurs, information ici
  //db.schema.createTable('utilisateurs', (table) => {
  //table.increments('id').primary();
  //table.string('nom');
  //table.string('prenom');
  //table.integer('age');
  //table.string('email');
  //table.string('numeroTelephone');
  //})
//.then(() => {
  //console.log('Table "utilisateurs" créée avec succès.');
//})
//.catch((error) => {
  //console.error('Erreur lors de la création de la table "utilisateurs":', error);
//});

//exporation de cette base de donnée
module.exports = db;
