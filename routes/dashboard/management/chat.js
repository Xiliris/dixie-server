const router = require("express").Router();
const dashboardSchema = require("../../../schemas/dashboard-schema");
const getGuildTextChannels = require("../../../modules/getGuildTextChannels");
const getGuildRoles = require("../../../modules/getGuildRoles");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found." });
    }

    const guildChannels = await getGuildTextChannels(id);
    const guildRoles = await getGuildRoles(id);

    return res.status(200).json({
      chat: dashboard.chatManagement,
      channels: guildChannels,
      roles: guildRoles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error!" });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { chatManagement } = req.body;

  try {
    await dashboardSchema.findOneAndUpdate(
      { guildId: id },
      { chatManagement },
      { upsert: true }
    );

    return res.status(200).json({ message: "Submit was successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error!" });
  }
});

module.exports = router;
