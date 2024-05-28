const router = require("express").Router();
const dashboardSchema = require("../../../schemas/dashboard-schema");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("GET request received for dashboard administration with ID:", id);

  try {
    const dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      console.log("Dashboard not found for ID:", id);
      return res.status(404).json({ message: "Dashboard not found" });
    }

    console.log("Dashboard found for ID:", id);
    res.status(200).json(dashboard.administration.warnings);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { infractions } = req.body;
  console.log(
    "POST request received for dashboard administration with ID:",
    id
  );
  console.log("Received data:", infractions);

  try {
    let dashboard = await dashboardSchema.findOne({ guildId: id });

    if (!dashboard) {
      console.log("Dashboard not found for ID:", id);
      dashboard = new dashboardSchema({
        guildId: id,
        administration: { warnings: infractions },
      });
    } else {
      console.log("Dashboard found for ID:", id);
      dashboard.administration.warnings = infractions;
    }

    await dashboard.save();
    console.log("Data saved successfully for ID:", id);
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving dashboard data:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
