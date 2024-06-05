const router = require("express").Router();
const botSchema = require("../../../../schemas/bot-schema");
const uploadAvatar = require("../../../../middlewere/upload-avatar");
const clientUpdate = require("../../../../bot/client-modules/client-update");

router.post("/:id", uploadAvatar.single("avatar"), async (req, res) => {
  const { guildId, name, status, activityType, activity } = req.body;

  try {
    const bot = await botSchema.findOne({ guildId });

    if (!bot) {
      return res.status(404).json({ message: "Bot not found." });
    }

    const apperence = {
      name,
      status,
      activityType,
      activity,
    };

    if (req.file) {
      apperence.avatar = req.file.filename;
    }

    await botSchema.findOneAndUpdate({ guildId }, apperence);

    const changeStatus = clientUpdate(bot.token);

    if (!changeStatus) {
      return res.status(500).json({
        message: "You are being rate limited try again in 5 minutes",
      });
    }

    return res.status(200).json({ message: "Bot was updated." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
