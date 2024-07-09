const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ban").setDescription("Ban a user"),
  async execute(interaction) {
    await interaction.reply("Banned user");
  },
};
