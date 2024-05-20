const { Client, GatewayIntentBits } = require("discord.js");

async function clientValidate(token, guildId) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  try {
    await client.login(token);
    client.destroy();
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = clientValidate;
