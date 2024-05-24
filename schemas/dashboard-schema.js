const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const chatManagment = {
  enabled: {
    type: Boolean,
    default: false,
  },
  punish: {
    type: String,
    default: "none",
  },
  time: {
    type: Number,
    default: 0,
  },
  disabledChannels: {
    type: Array,
    default: [],
  },
  allowedRoles: {
    type: Array,
    default: [],
  },
};

const dashboardSchema = new mongoose.Schema({
  guildId: reqString,
  clientId: reqString,
  chatManagment: {
    SPAM: chatManagment,
    LINKS: chatManagment,
    BAD_WORDS: chatManagment,
    REPEATED_MESSAGES: chatManagment,
    DISCORD_INVITES: chatManagment,
    CAPS: chatManagment,
    MASS_MENTION: chatManagment,
  },
});

module.exports = mongoose.model("dashboard", dashboardSchema);
