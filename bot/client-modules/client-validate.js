const { Client, GatewayIntentBits } = require("discord.js");

async function clientValidate(token) {
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
    const userObj = {
      name: client.user.username,
      clientId: client.user.id,
    };

    client.destroy();
    return userObj;
  } catch (err) {
    return false;
  }
}

module.exports = clientValidate;
