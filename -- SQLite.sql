-- SQLite


CREATE TABLE Coiffeur (
  idCoiffeur INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nomCoiffeur TEXT NOT NULL,
  prenomCoiffeur TEXT NOT NULL,
  numCoiffeur INTEGER NOT NULL,
  password TEXT UNIQUE NOT NULL,
  idSalon INTEGER NOT NULL,
  idService INTEGER,
  idPortfolio INTEGER,
  idDisponibilite INTEGER,
  FOREIGN KEY(idSalon) REFERENCES Salon(idSalon),
  FOREIGN KEY(idService) REFERENCES Service(idService),
  FOREIGN KEY(idPortfolio) REFERENCES Portfolio(idPortfolio),
  FOREIGN KEY(idDisponibilite) REFERENCES Disponibilite(idDisponibilite)
);

CREATE TABLE Client (
  idClient INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nomClient TEXT NOT NULL,
  prenomClient TEXT NOT NULL,
  numClient INTEGER NOT NULL,
  password TEXT UNIQUE NOT NULL
);

CREATE TABLE Rendezvous (
  idRendezvous INTEGER PRIMARY KEY AUTOINCREMENT,
  dateRendezvous DATE NOT NULL,
  heureRendezvous INTEGER NOT NULL,
  idClient INTEGER,
  idCoiffeur INTEGER,
  FOREIGN KEY(idClient) REFERENCES Client(idClient),
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

CREATE TABLE Salon (
  idSalon INTEGER PRIMARY KEY AUTOINCREMENT,
  nomSalon TEXT NOT NULL,
  adresseSalon TEXT NOT NULL,
  emailSalon TEXT NOT NULL,
  numSalon INTEGER NOT NULL
);

CREATE TABLE Service (
  idService INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT NOT NULL,
  idCoiffeur INTEGER,
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

CREATE TABLE Portfolio (
  idPortfolio INTEGER PRIMARY KEY AUTOINCREMENT,
  urlPhoto TEXT NOT NULL,
  idCoiffeur INTEGER,
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

CREATE TABLE Disponibilite (
  idDisponibilite INTEGER PRIMARY KEY AUTOINCREMENT,
  dateDisponibilite DATE NOT NULL,
  heureDisponibilite INTEGER NOT NULL,
  idCoiffeur INTEGER,
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

CREATE TABLE Coiffeur_Disponibilite (
  idCoiffeur_Disponibilite INTEGER PRIMARY KEY AUTOINCREMENT,
  idCoiffeur INTEGER NOT NULL,
  idDisponibilite INTEGER NOT NULL,
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur),
  FOREIGN KEY(idDisponibilite) REFERENCES Disponibilite(idDisponibilite)
);



CREATE TABLE Coiffeur_Service (
  idCoiffeur_Service INTEGER PRIMARY KEY AUTOINCREMENT,
  idCoiffeur INTEGER NOT NULL,
  idService INTEGER NOT NULL,
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur),
  FOREIGN KEY(idService) REFERENCES Service(idService)
);

CREATE TABLE Avis (
  idAvis INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreEtoile INTEGER NOT NULL,
  description TEXT NOT NULL,
  idClient INTEGER NOT NULL,
  idSalon INTEGER NOT NULL, -- Notez que cela devrait être idCoiffeur si vous suivez la structure originale que vous vouliez changer
  FOREIGN KEY(idClient) REFERENCES Client(idClient),
  FOREIGN KEY
