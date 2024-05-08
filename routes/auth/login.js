const router = require("express").Router();
const getUser = require("../../modules/getUser");

router.get("/:token", async (req, res) => {
  const { token } = req.params;

  const user = await getUser(token);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json(user);
});

module.exports = router;
