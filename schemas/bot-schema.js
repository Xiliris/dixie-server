const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const botSchema = new mongoose.Schema({
  guildId: reqString,
  clientId: reqString,
  token: reqString,
  name: reqString,
  description: reqString,
  status: reqString,
  avatar: reqString,
});

module.exports = mongoose.model("bot", botSchema);
