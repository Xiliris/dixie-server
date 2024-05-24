const botSchema = require("../../schemas/bot-schema");
const chatManagment = require("../chat-manager/chat-managment");
async function messageHandler(client, message) {
  const bot = await botSchema.findOne({ guildId: message.guild.id });

  if (bot) {
    if (client.user.id !== bot.clientId) {
      return;
    }

    chatManagment(client, message);
  }
}

module.exports = messageHandler;
