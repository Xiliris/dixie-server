const router = require("express").Router();
const getUser = require("../../modules/getUser");

router.get("/", async (req, res) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUser(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
