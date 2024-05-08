const router = require("express").Router();

router.get("/:token", async (req, res) => {
  const { token } = req.params;
});

module.exports = router;
