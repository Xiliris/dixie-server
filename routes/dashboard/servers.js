const router = require("express").Router();
const getGuilds = require("../../modules/getGuilds");
const dashboardSchema = require("../../schemas/dashboard-schema");

router.get("/", async (req, res) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const guilds = await getGuilds(token);

    if (!guilds) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vaildPermission = guilds.guilds.filter(
      (guild) => (guild.permissions & 0x8) !== 0
    );

    const dashboard = await dashboardSchema.find();

    const botJoined = vaildPermission.filter((guild) => {
      return dashboard.some(
        (dashboardGuild) => dashboardGuild.guildId === guild.id
      );
    });

    const validGuild = vaildPermission.map((guild) => ({
      ...guild,
      joined: botJoined.some((joinedGuild) => joinedGuild.id === guild.id),
    }));

    console.log(validGuild);

    return res.status(200).json(validGuild.sort((a, b) => b.joined - a.joined));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
