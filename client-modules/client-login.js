const { Client, GatewayIntentBits } = require("discord.js");
const registerCommands = require("../handlers/register-commands");
const commandHandler = require("../handlers/command-handler");
const botSchema = require("../schemas/bot-schema");
const dashboard = require("../schemas/dashboard-schema");

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

  client.once("ready", () => {
    console.log(`> Logged in as ${client.user.tag}`);
    registerCommands(client, token);

    if (guildId) {
      clientSave(guildId, client.user.id, token);
    }
  });

  client.on("guildCreate", (guild) => {
    guildSave(guild.id);
  });

  client.on("interactionCreate", async (interaction) => {
    commandHandler(client, interaction);
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

async function guildSave(guildId) {
  if (!guildId) {
    return null;
  }

  await dashboard.findOneAndUpdate(
    {
      guildId,
    },
    {
      guildId,
    },
    {
      upsert: true,
    }
  );
}

module.exports = clientLogin;
