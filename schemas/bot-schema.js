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
  description: {
    type: String,
    required: true,
    default: "I am cute!",
  },
  status: {
    type: String,
    required: true,
    default: "online",
  },
  avatar: reqString,
});

module.exports = mongoose.model("bot", botSchema);
