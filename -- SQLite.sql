-- Création de la table Coiffeur
CREATE TABLE IF NOT EXISTS Coiffeur (
    idCoiffeur INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nomCoiffeur TEXT NOT NULL,
    prenomCoiffeur TEXT NOT NULL,
    numCoiffeur INTEGER NOT NULL,
    password TEXT UNIQUE NOT NULL,
    idSalon INTEGER NOT NULL,
    FOREIGN KEY (idSalon) REFERENCES Salon(idSalon)
);

-- Création de la table Client
CREATE TABLE IF NOT EXISTS Client (
    idClient INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nomClient TEXT NOT NULL,
    prenomClient TEXT NOT NULL,
    numClient INTEGER NOT NULL,
    password TEXT UNIQUE NOT NULL
);

-- Création de la table RendezVous
CREATE TABLE IF NOT EXISTS Rendezvous (
    idRendezvous INTEGER PRIMARY KEY,
    dateRendezvous DATE NOT NULL,
    heureRendezvous INTEGER NOT NULL,
    idClient INTEGER,
    idCoiffeur INTEGER,
    FOREIGN KEY (idClient) REFERENCES Client(idClient),
    FOREIGN KEY (idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

-- Création de la table Salon
CREATE TABLE IF NOT EXISTS Salon (
    idSalon INTEGER PRIMARY KEY,
    nomSalon TEXT NOT NULL,
    adresseSalon TEXT NOT NULL,
    emailSalon TEXT NOT NULL,
    numSalon INTEGER NOT NULL
);

-- Création de la table Service
CREATE TABLE IF NOT EXISTS Service (
    idService INTEGER PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Création de la table Portfolio
CREATE TABLE IF NOT EXISTS Portfolio (
    idPortfolio INTEGER PRIMARY KEY,
    urlPhoto TEXT NOT NULL,
    idCoiffeur INTEGER UNIQUE,
    FOREIGN KEY (idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

-- Création de la table Disponibilite
CREATE TABLE IF NOT EXISTS Disponibilite (
    idDisponibilite INTEGER PRIMARY KEY,
    dateDisponibilite DATE NOT NULL,
    heureDisponibilite INTEGER NOT NULL,
    idCoiffeur INTEGER,
    FOREIGN KEY (idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

-- Création de la table Coiffeur_Disponibilite
CREATE TABLE IF NOT EXISTS Coiffeur_Disponibilite (
    idCoiffeur_Disponibilite INTEGER PRIMARY KEY,
    idCoiffeur INTEGER NOT NULL,
    idDisponibilite INTEGER NOT NULL,
    FOREIGN KEY (idCoiffeur) REFERENCES Coiffeur(idCoiffeur),
    FOREIGN KEY (idDisponibilite) REFERENCES Disponibilite(idDisponibilite)
);

-- Création de la table Coiffeur_Client
CREATE TABLE IF NOT EXISTS Coiffeur_Client (
    idCoiffeur_Client INTEGER PRIMARY KEY,
    idCoiffeur INTEGER NOT NULL,
    idClient INTEGER NOT NULL,
    FOREIGN KEY (idCoiffeur) REFERENCES Coiffeur(idCoiffeur),
    FOREIGN KEY (idClient) REFERENCES Client(idClient)
);

-- Création de la table Coiffeur_Service
CREATE TABLE IF NOT EXISTS Coiffeur_Service (
    idCoiffeur_Service INTEGER PRIMARY KEY,
    idCoiffeur INTEGER NOT NULL,
    idService INTEGER NOT NULL
);
