const router = require("express").Router();
const getUser = require("../../modules/getUser");
const { redisClient } = require("../../database/loadRedisDatabase");

router.get("/", async (req, res) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cachedUser = await redisClient.get(token);

    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }

    const user = await getUser(token);
    await redisClient.setEx(token, 1800, JSON.stringify(user));

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
