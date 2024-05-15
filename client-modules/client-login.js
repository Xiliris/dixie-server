const { Client, GatewayIntentBits } = require("discord.js");
const botSchema = require("../schemas/bot-schema");

function clientLogin(token, guildId) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on("ready", () => {
    console.log(`> Logged in as ${client.user.tag}`);

    if (guildId) {
      clientSave(guildId, client.user.id, token);
    }
  });

  client.on("messageCreate", (message) => {
    if (message.content === "ping") {
      message.reply("PONG!");
    }
  });

  client.login(token);
}

async function clientSave(guildId, clientId, token) {
  if (!guildId || !clientId || !token) {
    return null;
  }

  await botSchema.findOneAndUpdate(
    {
      guildId,
    },
    {
      guildId,
      clientId,
      token,
    },
    {
      upsert: true,
    }
  );
}

module.exports = clientLogin;
