const router = require("express").Router();
const clientLogin = require("../../client-modules/client-login");
const clientValidate = require("../../client-modules/client-validate");

router.post("/", async (req, res) => {
  const { token, guildId } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validate = await clientValidate(token);

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
