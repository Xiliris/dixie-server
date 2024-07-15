const router = require("express").Router();
const dashboardSchema = require("../../../schemas/dashboard-schema");
const getGuildTextChannels = require("../../../modules/getGuildTextChannels");
const getGuildRoles = require("../../../modules/getGuildRoles");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let dashboard = await dashboardSchema.findOne({ guildId: id });
    dashboard.chatManagement.BLACKLISTED_WORDS.blacklisted =
      dashboard.chatManagement.BLACKLISTED_WORDS.blacklisted.join(", ");

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
  let { chatManagement } = req.body;

  console.log(chatManagement.BLACKLISTED_WORDS);

  chatManagement.BLACKLISTED_WORDS.blacklisted =
    chatManagement.BLACKLISTED_WORDS.blacklisted[0]
      .split(",")
      .map((word) => word.trim());

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
