const router = require("express").Router();
require("dotenv").config();
const authUser = require("../../modules/authUser");

router.get("/", async (req, res) => {
  const { code } = req.query;

  try {
    const access_token = await authUser(code);

    if (!access_token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ token: access_token });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
