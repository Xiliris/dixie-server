const router = require("express").Router();
require("dotenv").config();
const authUser = require("../../modules/authUser");

router.get("/", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Bad Request" });
    }

    try {
      const access_token = await authUser(code);

      if (!access_token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.status(200).json({ token: access_token });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
