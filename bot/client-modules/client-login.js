const { Client, GatewayIntentBits } = require("discord.js");
const registerCommands = require("../client-handlers/command-register");
const commandHandler = require("../client-handlers/command-handler");
const messageHandler = require("../client-handlers/message-handler");
const welcomeHandler = require("../client-handlers/welcome-handler");
const clientApperence = require("./client-apperence");
const { clientSave, guildSave } = require("./client-database");

function clientLogin(token, guildId) {
  if (!token) return console.log("Token is required to login the client");

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
    console.log(`> Added client - ${client.user.tag}`);
    registerCommands(client, token);
    clientApperence(client);

    if (guildId) {
      clientSave(guildId, client.user.id, token);
    }
  });

  client.on("guildCreate", (guild) => {
    guildSave(client, guild);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    console.log(interaction.commandName);

    commandHandler(client, interaction);
  });

  client.on("messageCreate", (message) => {
    if (message.author.bot) {
      return;
    }

    messageHandler(client, message);
  });

  client.on("guildMemberAdd", (member) => {
    welcomeHandler(member);
  });

  client.login(token);
}

module.exports = clientLogin;
