const router = require("express").Router();
const dashboardSchema = require("../../../schemas/dashboard-schema");
const getGuildChannels = require("../../../modules/getGuildChannels");
const getGuildRoles = require("../../../modules/getGuildRoles");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found." });
    }

    const guildChannels = await getGuildChannels(id);
    const guildRoles = await getGuildRoles(id);

    console.log(guildChannels, guildRoles);

    return res.status(200).json({
      chat: dashboard.chatManagment,
      channels: guildChannels,
      roles: guildRoles,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { chatManagment } = req.body;

  try {
    await dashboardSchema.findOneAndUpdate(
      { guildId: id },
      { chatManagment },
      { upsert: true }
    );

    return res
      .status(200)
      .json({ message: "Chat management settings updated successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
