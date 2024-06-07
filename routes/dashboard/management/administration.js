const router = require("express").Router();
const dashboardSchema = require("../../../schemas/dashboard-schema");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found!" });
    }

    const { warnings, commands } = dashboard.administration;

    return res.status(200).json({ warnings, commands });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { infractions, commands } = req.body;

  try {
    let dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      dashboard = new dashboardSchema({
        guildId: id,
        administration: { warnings: infractions, commands },
      });
    } else {
      dashboard.administration.warnings = infractions;
      dashboard.administration.commands = commands;
    }

    await dashboard.save();
    res.status(200).json({ message: "Submit was successful!" });
  } catch (error) {
    console.error("There was an error!", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
