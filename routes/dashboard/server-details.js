const router = require("express").Router();
const getGuildDetails = require("../../modules/getGuildDetails");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const guild = await getGuildDetails(id);

  if (!guild) {
    return res.status(404).json({ message: "Guild not found" });
  }

  return res.status(200).json(guild);
});

module.exports = router;
