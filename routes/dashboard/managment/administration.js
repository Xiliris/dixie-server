const router = require("express").Router();
const dashboardSchema = require("../../../schemas/dashboard-schema");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found!" });
    }

    const warnings = dashboard.administration.warnings;

    res.status(200).json({ warnings });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { infractions, clientId } = req.body;

  try {
    let dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      dashboard = new dashboardSchema({
        guildId: id,
        clientId: clientId || undefined,
        administration: { warnings: infractions },
      });
    } else {
      dashboard.clientId = clientId || dashboard.clientId;
      dashboard.administration.warnings = infractions;
    }

    await dashboard.save();
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving dashboard data:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
