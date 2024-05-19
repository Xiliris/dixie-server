const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance"),
  async execute(interaction) {
    await interaction.reply("Your balance is $100");
  },
};
