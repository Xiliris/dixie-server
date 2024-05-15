const router = require("express").Router();
const botSchema = require("../../../schemas/bot-schema");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bot = await botSchema.findOne({ guildId: id });

    if (!bot) {
      return res.status(404).json({ message: "Bot not found." });
    }

    return res.status(200).json(bot);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
