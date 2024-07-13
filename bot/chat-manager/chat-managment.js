const dashboardSchema = require("../../schemas/dashboard-schema");
const { PermissionsBitField } = require("discord.js");

const chatModules = {
  LINKS: require("./chat-modules/chat-links"),
  SPAM: require("./chat-modules/chat-spam"),
  BAD_WORDS: require("./chat-modules/chat-bad-words"),
  REPEATED_MESSAGES: require("./chat-modules/chat-repeated-messages"),
  DISCORD_INVITES: require("./chat-modules/chat-discord-invites"),
  CAPS: require("./chat-modules/chat-caps"),
  MASS_MENTION: require("./chat-modules/chat-mass-mention"),
};

async function chatManagment(client, message) {
  const dashboard = await dashboardSchema.findOne({
    guildId: message.guild.id,
  });

  const chatManagment = dashboard?.chatManagement;

  if (!chatManagment) {
    return null;
  }

  if (message.author.bot) return;
  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator))
    return;

  for (const [key, module] of Object.entries(chatModules)) {
    if (chatManagment[key]) {
      chatManagment[key].disabledChannels.forEach((channel) => {
        if (message.channel.id != channel.id) {
          module(message, chatManagment[key]);
        }
      });
    }
  }
}

module.exports = chatManagment;
