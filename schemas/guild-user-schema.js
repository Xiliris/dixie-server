const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const guildUserSchema = new mongoose.Schema({
  discordId: reqString,
  guildId: reqString,
  warnings: {
    type: Array,
    default: [],
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  bank: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("guild-user", guildUserSchema);