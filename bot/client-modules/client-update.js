const { Client, GatewayIntentBits } = require("discord.js");
const clientApperence = require("./client-apperence");

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

  client.once("ready", async () => {
    await clientApperence(client);
    client.destroy();
  });

  try {
    await client.login(token);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = clientValidate;
