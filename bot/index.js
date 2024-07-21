const { Client, GatewayIntentBits } = require("discord.js");
const registerCommands = require("./client-handlers/command-register");
const commandHandler = require("./client-handlers/command-handler");
const clientApperence = require("./client-modules/client-apperence");
const messageHandler = require("./client-handlers/message-handler");
const welcomeHandler = require("./event-handlers/welcome-handler");
const goodbyeHandler = require("./event-handlers/goodbye-handler");
const { guildSave, guildDelete } = require("./client-modules/client-database");
const token = process.env.CLIENT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

client.once("ready", () => {
  console.log(`> Connected to ${client.user.tag}`);
  registerCommands(client, token);
  clientApperence(client);
});

client.on("guildCreate", (guild) => {
  guildSave(client, guild);
});

client.on("guildDelete", (guild) => {
  guildDelete(guild.id);
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

client.on("guildMemberRemove", (member) => {
  goodbyeHandler(member);
});

client.login(token);

module.exports = client;
