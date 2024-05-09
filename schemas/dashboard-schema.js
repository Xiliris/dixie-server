const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const dashboardSchema = new mongoose.Schema({
  guildId: reqString,
});

module.exports = mongoose.model("dashboard", dashboardSchema);
