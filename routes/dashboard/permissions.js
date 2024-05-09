const router = require("express").Router();
const getGuilds = require("../../modules/getGuilds");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const guilds = await getGuilds(token);

    if (!guilds) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vaildPermission = guilds.guilds.filter(
      (guild) => (guild.permissions & 0x8) !== 0
    );

    const validGuild = vaildPermission.find((guild) => guild.id === id);

    if (!validGuild) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(validGuild);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
