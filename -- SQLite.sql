--LES TABLES SONT EN BAS:
--ICI CE SONT LES TEST:
-- Insertions dans la table Coiffeur
INSERT INTO Coiffeur (email, nomCoiffeur, prenomCoiffeur, numCoiffeur, password, idSalon, idService, idPortfolio, idDisponibilite) 
VALUES ('coiffeur1@example.com', 'Dupont', 'Jean', 123456789, 'password123', 1, 1, 1, 1),
       ('coiffeur2@example.com', 'Martin', 'Sophie', 987654321, 'password456', 2, 2, 2, 2),
       ('coiffeur3@example.com', 'Leblanc', 'Luc', 555555555, 'password789', 3, 3, 3, 3);

-- Insertions dans la table Client
INSERT INTO Client (email, nomClient, prenomClient, numClient, password) 
VALUES ('client1@example.com', 'Durand', 'Alice', 111111111, 'clientpassword1'),
       ('client2@example.com', 'Petit', 'Paul', 222222222, 'clientpassword2'),
       ('client3@example.com', 'Moreau', 'Emma', 333333333, 'clientpassword3');

-- Insertions dans la table Rendezvous
INSERT INTO Rendezvous (dateRendezvous, heureRendezvous, idClient, idCoiffeur) 
VALUES ('2024-04-15', 10, 1, 1),
       ('2024-04-16', 14, 2, 2),
       ('2024-04-17', 16, 3, 3);

-- Insertions dans la table Salon
INSERT INTO Salon (nomSalon, adresseSalon, emailSalon, numSalon) 
VALUES ('Salon A', '1 Rue de Paris', 'contact@salona.com', 123456789),
       ('Salon B', '2 Avenue des Champs-Élysées', 'contact@salonb.com', 987654321),
       ('Salon C', '3 Rue du Commerce', 'contact@salonc.com', 555555555);

-- Insertions dans la table Service
INSERT INTO Service (nom, description, idCoiffeur) 
VALUES ('Coupe de cheveux', 'Service de coupe de cheveux', 1),
       ('Coloration', 'Service de coloration des cheveux', 2),
       ('Coiffure mariage', 'Service de coiffure pour mariage', 3);

-- Insertions dans la table Portfolio
INSERT INTO Portfolio (urlPhoto, idCoiffeur) 
VALUES ('https://example.com/photo1.jpg', 1),
       ('https://example.com/photo2.jpg', 2),
       ('https://example.com/photo3.jpg', 3);

-- Insertions dans la table Disponibilite
INSERT INTO Disponibilite (dateDisponibilite, heureDisponibilite, idCoiffeur) 
VALUES ('2024-04-15', 10, 1),
       ('2024-04-16', 14, 2),
       ('2024-04-17', 16, 3);

-- Insertions dans la table Coiffeur_Disponibilite
INSERT INTO Coiffeur_Disponibilite (idCoiffeur, idDisponibilite) 
VALUES (1, 1),
       (2, 2),
       (3, 3);

-- Insertions dans la table Coiffeur_Client
INSERT INTO Coiffeur_Client (idCoiffeur, idClient) 
VALUES (1, 1),
       (2, 2),
       (3, 3);

-- Insertions dans la table Coiffeur_Service
INSERT INTO Coiffeur_Service (idCoiffeur, idService) 
VALUES (1, 1),
       (2, 2),
       (3, 3);

-- Insertions dans la table Avis
INSERT INTO Avis (nombreEtoile, description, idClient, idSalon) 
VALUES (5, 'Très satisfait du service!', 1, 1),
       (4, 'Bonne prestation, mais peut être améliorée.', 2, 2),
       (3, 'Expérience moyenne, rien dextraordinaire.', 3, 3);




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
