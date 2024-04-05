// script pour le front end:  Obtenir un salon par son nom
router.get("/salon", async (req, res) => {
  const { nomSalon } = req.body;

  try {
    const salon = await db("Salon")
      .where("nomSalon", "like", `%${nomSalon}%`)
      .first();
    if (!salon) {
      return res.status(404).json({ message: "Salon non trouvé." });
    }

    res.status(200).json(salon);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Une erreur s'est produite lors de la recherche du salon.",
      });
  }
});
