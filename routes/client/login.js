const router = require("express").Router();
const clientLogin = require("../../bot/index");
const clientValidate = require("../../bot/client-modules/client-validate");
const botSchema = require("../../schemas/bot-schema");

router.post("/", async (req, res) => {
  const { token, guildId } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bot = await botSchema.findOne({ token });

  if (bot) {
    return res.status(401).json({ message: "Client already created." });
  }

  const validate = await clientValidate(token, guildId);

  if (!validate) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    clientLogin(token, guildId);
    res.status(200).json({ message: "Client was created." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
