
// -------------------------- client ---------------------------------------------------
//rendez vous coté client
/*app.get("/rendezVousClient", authentification, async (req, res) => {
    try {
      const unEmail = req.user; // Email de l'utilisateur extrait du token
      const rendezVous = await rendezvousCoiffeur(unEmail);
      res.json({
        rendezVous: rendezVous,
        message: "Bienvenue dans le board sécurisé " + req.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Une erreur s'est produite lors de la récupération des rendez-vous.",
      });
    }
  });
  
  //fonction rendezvous client
  function rendezvousClient(unEmail) {
    return new Promise((resolve, reject) => {
      db.select("*")
        .from("rendezvous")
        .join("Client", "rendezvous.idClient", "=", "Client.idClient")
        .where("Client.email", unEmail)
        .then((rows) => {
          resolve(rows);
        })
        .catch((err) => {
  */
  
//module.exports= router;