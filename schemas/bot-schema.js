const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const botSchema = new mongoose.Schema({
  guildId: reqString,
  clientId: reqString,
  token: reqString,
  name: {
    type: String,
    required: true,
    default: "Dixie",
  },
  status: {
    type: String,
    required: true,
    default: "online",
  },
  activityType: {
    type: String,
    required: true,
    default: "PLAYING",
  },
  activity: {
    type: String,
    required: true,
    default: "Dixie Bot",
  },
  avatar: reqString,
});

module.exports = mongoose.model("bot", botSchema);
