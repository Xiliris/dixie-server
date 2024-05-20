const router = require("express").Router();
const botSchema = require("../../schemas/bot-schema");
const uploadAvatar = require("../../middlewere/upload-avatar");

router.post("/:id", uploadAvatar.single("avatar"), async (req, res) => {
  const { guildId, name, description, status } = req.body;
  let avatar = null;

  if (req.file) {
    avatar = req.file.filename;
  }

  try {
    const bot = await botSchema.findOne({ guildId });

    if (!bot) {
      return res.status(404).json({ message: "Bot not found." });
    }

    await botSchema.findOneAndUpdate(
      { guildId },
      { name, description, status, avatar }
    );

    return res.status(200).json({ message: "Bot was updated." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
