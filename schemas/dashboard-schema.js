const { channelLink } = require("discord.js");
const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
  default: "",
};

const reqBoolean = {
  type: Boolean,
  required: true,
  default: false,
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
  welcomeGoodbye: {
    welcomeMessage: {
      enabled: reqBoolean,
      channel: reqString,
      text: reqString,
    },
    welcomeImage: {
      enabled: reqBoolean,
      channel: reqString,
      image: reqString,
      text: reqString,
    },
    goodbyeMessage: {
      enabled: reqBoolean,
      channel: reqString,
      text: reqString,
    },
    administration: {
      warnings: [
        {
          numInfractions: { type: Number, required: true },
          punishmentType: { type: String, required: true },
          time: { type: Number, required: true },
        },
      ],
    },
  },
});

module.exports = mongoose.model("dashboard", dashboardSchema);
