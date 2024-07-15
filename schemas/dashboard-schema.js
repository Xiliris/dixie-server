const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
  default: "",
};

const optionalString = {
  type: String,
  required: false,
  default: "",
};

const reqBoolean = {
  type: Boolean,
  required: true,
  default: false,
};

const chatManagement = {
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
  clientId: optionalString,
  chatManagement: {
    SPAM: chatManagement,
    LINKS: chatManagement,
    BAD_WORDS: chatManagement,
    REPEATED_MESSAGES: chatManagement,
    DISCORD_INVITES: chatManagement,
    CAPS: chatManagement,
    MASS_MENTION: chatManagement,
    BLACKLISTED_WORDS: {
      ...chatManagement,
      blacklisted: {
        type: Array,
        default: [],
        required: true,
      },
    },
  },
  welcomeGoodbye: {
    welcomeMessage: {
      enabled: reqBoolean,
      channel: optionalString,
      text: optionalString,
    },
    welcomeImage: {
      enabled: reqBoolean,
      channel: optionalString,
      image: optionalString,
      text: {
        enabled: reqBoolean,
        text: optionalString,
      },
    },
    goodbyeMessage: {
      enabled: reqBoolean,
      channel: optionalString,
      text: optionalString,
    },
  },
  administration: {
    warnings: [
      {
        numInfractions: { type: Number, required: false },
        punishmentType: { type: String, required: false },
        time: { type: Number, required: false },
      },
    ],
    commands: [
      {
        command: { type: String, required: true },
        roles: { type: [String], default: [] },
      },
    ],
  },
});

module.exports = mongoose.model("dashboard", dashboardSchema);
