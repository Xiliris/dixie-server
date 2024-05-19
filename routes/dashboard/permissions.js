const router = require("express").Router();
const { redisClient } = require("../../database/loadRedisDatabase");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = JSON.parse(await redisClient.get(`guilds:${token}`));
    const validGuild = user.guilds.find((guild) => guild.id === id);

    if (!validGuild) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(validGuild);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
