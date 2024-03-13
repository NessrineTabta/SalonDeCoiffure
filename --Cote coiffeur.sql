--Cote coiffeur
-- Table coiffeur
CREATE TABLE Coiffeur (
  idCoiffeur integer primary key auto increment, 
  nomCoiffeur TEXT NOT NULL, 
  prenomCoiffeur TEXT NOT NULL,
  numCoiffeur integer NOT NULL,
  FOREIGN KEY(idSalon) REFERENCES Salon(salonid)
  FOREIGN KEY(idService) REFERENCES Service(serviceid)
  FOREIGN KEY(idPortfolio) REFERENCES Portfolio(portfolioid)
  FOREIGN KEY(idDisponibilite) REFERENCES Disponibilite(disponibiliteid)
  FOREIGN KEY(idInscription) REFERENCES InscriptionCoiffeur(inscriptionid)

);

-- Table salon
CREATE TABLE Salon (
  idSalon integer primary key auto increment, 
  nomSalon TEXT NOT NULL, 
  adresseSalon TEXT NOT NULL,
  emailSalon TEXT NOT NULL,
  numSalon integer NOT NULL,
  
);

-- Table Inscription Coiffeur
CREATE TABLE InscriptionCoiffeur (
  idInscription integer primary key auto increment, 
  token TEXT NOT NULL, 
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

-- Table Service
CREATE TABLE Service (
  idService integer primary key auto increment, 
  nom TEXT NOT NULL, 
  description TEXT NOT NULL, 
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)
);

-- Table Portofolio
CREATE TABLE Portofolio (
  idPortofolio integer primary key auto increment, 
  urlPhoto TEXT NOT NULL, 
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)

);

-- Table Disponibilite
CREATE TABLE Disponibilite (
  idDisponibilite integer primary key auto increment, 
  date date NOT NULL, 
  date TEXT NOT NULL, 
  FOREIGN KEY(idCoiffeur) REFERENCES Coiffeur(idCoiffeur)

);