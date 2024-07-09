const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping"),
  async execute(interaction) {
    console.log(interaction);
  },
};
