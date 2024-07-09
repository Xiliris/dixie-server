const dashboardSchema = require("../../schemas/dashboard-schema");
const { PermissionsBitField } = require("discord.js");
const chatLinks = require("./chat-modules/chat-links");
const chatSpam = require("./chat-modules/chat-spam");
const chatBadWords = require("./chat-modules/chat-bad-words");
const chatRepeatedMessages = require("./chat-modules/chat-repeated-messages");
const chatDiscordInvites = require("./chat-modules/chat-discord-invites");
const chatCaps = require("./chat-modules/chat-caps");
const chatMassMention = require("./chat-modules/chat-mass-mention");

async function chatManagment(client, message) {
  const dashboard = await dashboardSchema.findOne({
    guildId: message.guild.id,
  });

  const chatManagment = dashboard.chatManagement;

  if (!chatManagment) {
    return null;
  }

  if (chatManagment && chatManagment.LINKS) {
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return;

    chatLinks(message, chatManagment.LINKS);
    chatSpam(message, chatManagment.SPAM);
    chatBadWords(message, chatManagment.BAD_WORDS);
    chatRepeatedMessages(message, chatManagment.REPEATED_MESSAGES);
    chatDiscordInvites(message, chatManagment.DISCORD_INVITES);
    chatCaps(message, chatManagment.CAPS);
    chatMassMention(message, chatManagment.MASS_MENTION);
  }
}

module.exports = chatManagment;
