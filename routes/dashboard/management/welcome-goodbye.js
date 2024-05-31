const dashboardSchema = require("../../../schemas/dashboard-schema");
const getGuildTextChannels = require("../../../modules/getGuildTextChannels");
const router = require("express").Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const dashboard = await dashboardSchema.findOne({ guildId: id });

  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found." });
  }

  const guildChannels = await getGuildTextChannels(id);

  console.log(guildChannels);

  return res
    .status(200)
    .json({ dashboard: dashboard.welcomeGoodbye, channels: guildChannels });
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { welcomeMessage, welcomeImage, goodbyeMessage } = req.body;

  if (!welcomeMessage)
    return res
      .status(400)
      .json({ message: "Please provide a welcome message." });
  if (!welcomeImage)
    return res.status(400).json({ message: "Please provide a welcome image." });
  if (!goodbyeMessage)
    return res
      .status(400)
      .json({ message: "Please provide a goodbye message." });

  const dashboard = await dashboardSchema.findOne({ guildId: id });

  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found." });
  }

  try {
    await dashboardSchema.findOneAndUpdate(
      { guildId: id },
      { welcomeGoodbye: { welcomeMessage, welcomeImage, goodbyeMessage } },
      { upsert: true }
    );
    return res
      .status(200)
      .json({ message: "Welcome and goodbye settings updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
