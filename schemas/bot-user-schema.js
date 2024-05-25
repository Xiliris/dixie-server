const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema({
  discordId: reqString,
  guildId: reqString,
  warnings: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("guild-user", guildUserSchema);
