// constante demande les prérequis knex (la librairie db)
const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./salonDeCoiffure.sqlite3", // Le chemin vers votre fichier SQLite3
  },
  useNullAsDefault: true,
});

// Fonction pour créer ou mettre à jour une table
async function updateTable(tableName, callback) {
  const exists = await db.schema.hasTable(tableName);
  if (!exists) {
    await callback();
    console.log(`Table ${tableName} créée`);
  } else {
  }
}


// Création de la table Coiffeur
updateTable('Coiffeur', async () => {
  await db.schema.createTable('Coiffeur', table => {
    table.increments('idCoiffeur').primary();
    table.string('email').unique().notNullable();
    table.string('nomCoiffeur').notNullable();
    table.string('prenomCoiffeur').notNullable();
    table.integer('numCoiffeur').notNullable();
    table.string('password').unique().notNullable();
    table.integer('idSalon').notNullable();
    table.integer('idService').unsigned();
    table.integer('idPortfolio').unsigned();
    table.integer('idDisponibilite').unsigned();
    table.foreign('idSalon').references('Salon.idSalon');
    table.foreign('idService').references('Service.idService');
    table.foreign('idPortfolio').references('Portfolio.idPortfolio');
    table.foreign('idDisponibilite').references('Disponibilite.idDisponibilite');
  });
});

// Création de la table Client
updateTable('Client', async () => {
  await db.schema.createTable('Client', table => {
    table.increments('idClient').primary();
    table.string('email').unique().notNullable();
    table.string('nomClient').notNullable();
    table.string('prenomClient').notNullable();
    table.integer('numClient').notNullable();
    table.string('password').unique().notNullable();
  });
});

// Création de la table RendezVous
updateTable('Rendezvous', async () => {
  await db.schema.createTable('Rendezvous', table => {
    table.increments('idRendezvous').primary();
    table.date('dateRendezvous').notNullable();
    table.integer('heureRendezvous').notNullable();
    table.integer('idClient').unsigned();
    table.foreign('idClient').references('Client.idClient');
    table.integer('idCoiffeur').unsigned();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
  });
});

// Création de la table Salon
updateTable('Salon', async () => {
  await db.schema.createTable('Salon', table => {
    table.increments('idSalon').primary();
    table.string('nomSalon').notNullable();
    table.string('adresseSalon').notNullable();
    table.string('emailSalon').notNullable();
    table.integer('numSalon').notNullable();
  });
});

// Création de la table Service
updateTable('Service', async () => {
  await db.schema.createTable('Service', table => {
    table.increments('idService').primary();
    table.string('nom').notNullable();
    table.string('description').notNullable();
    table.integer('idCoiffeur').unsigned();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
  });
});

// Création de la table Portfolio
updateTable('Portfolio', async () => {
  await db.schema.createTable('Portfolio', table => {
    table.increments('idPortfolio').primary();
    table.string('urlPhoto').notNullable();
    table.integer('idCoiffeur').unsigned().unique();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
  });
});

// Création de la table Disponibilite
updateTable('Disponibilite', async () => {
  await db.schema.createTable('Disponibilite', table => {
    table.increments('idDisponibilite').primary();
    table.date('dateDisponibilite').notNullable();
    table.integer('heureDisponibilite').notNullable();
    table.integer('idCoiffeur').unsigned();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
  });
});

// Création de la table Coiffeur_Disponibilite
updateTable('Coiffeur_Disponibilite', async () => {
  await db.schema.createTable('Coiffeur_Disponibilite', table => {
    table.increments('idCoiffeur_Disponibilite').primary();
    table.integer('idCoiffeur').unsigned().notNullable();
    table.integer('idDisponibilite').unsigned().notNullable();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
    table.foreign('idDisponibilite').references('Disponibilite.idDisponibilite');
  });
});

// Création de la table Coiffeur_Client
updateTable('Coiffeur_Client', async () => {
  await db.schema.createTable('Coiffeur_Client', table => {
    table.increments('idCoiffeur_Client').primary();
    table.integer('idCoiffeur').unsigned().notNullable();
    table.integer('idClient').unsigned().notNullable();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
    table.foreign('idClient').references('Client.idClient');
  });
});

// Création de la table Coiffeur_Service
updateTable('Coiffeur_Service', async () => {
  await db.schema.createTable('Coiffeur_Service', table => {
    table.increments('idCoiffeur_Service').primary();
    table.integer('idCoiffeur').unsigned().notNullable();
    table.integer('idService').unsigned().notNullable();
    table.foreign('idCoiffeur').references('Coiffeur.idCoiffeur');
    table.foreign('idService').references('Service.idService');
  });
});

// Création de la table Avis
updateTable('Avis', async () => {
  await db.schema.createTable('Avis', table => {
    table.increments('idAvis').primary();
    table.integer('nombreEtoile').notNullable();
    table.string('description').notNullable();
    table.integer('idClient').unsigned().notNullable();
    table.integer('idSalon').unsigned().notNullable();
    table.foreign('idClient').references('Client.idClient');
    table.foreign('idSalon').references('Salon.idSalon');
  });
});

//exporation de cette base de donnée
module.exports = db;
