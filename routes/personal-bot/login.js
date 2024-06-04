const router = require("express").Router();
const clientValidate = require("../../bot/client-modules/client-validate");
const getUser = require("../../modules/getUser");
const botSchema = require("../../schemas/bot-schema");

router.post("/", async (req, res) => {
  const { personalBotToken } = req.body;
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!personalBotToken) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const bot = await botSchema.findOne({ token: personalBotToken });

  if (bot) {
    return res.status(400).json({ message: "Bot already registered." });
  }

  const client = await clientValidate(personalBotToken);
  const { user } = await getUser(token);

  if (!client) {
    return res.status(400).json({ message: "Invalid token." });
  }

  try {
    await botSchema.findOneAndUpdate(
      {
        userId: user.id,
        token: personalBotToken,
      },
      {
        userId: user.id,
        token: personalBotToken,
        name: client.name,
        clientId: client.clientId,
      },
      {
        upsert: true,
      }
    );

    res.status(200).json({ message: "Bot registered." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
