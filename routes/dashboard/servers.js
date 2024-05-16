const router = require("express").Router();
const getGuilds = require("../../modules/getGuilds");
const dashboardSchema = require("../../schemas/dashboard-schema");

router.get("/", async (req, res) => {
  try {
    const { token } = req.headers;

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

    const validGuild = vaildPermission.map((guild) => {
      if (botJoined.includes(guild)) {
        return { ...guild, joined: true };
      } else {
        return { ...guild, joined: false };
      }
    });

    console.log(
      "validGuilds: ",
      validGuild.sort((a, b) => b.joined - a.joined)
    );

    return res.status(200).json(validGuild.sort((a, b) => b.joined - a.joined));
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
