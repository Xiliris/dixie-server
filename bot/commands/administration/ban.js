const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ban").setDescription("Ban a user").addUserOption(option =>
    option.setName('user')
        .setDescription('user for mute/ban/nmp bgm')
        .setRequired(true)),
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user")
    console.log(targetUser)
    await interaction.reply(`User <@${targetUser.id}> has been banned!`);
  },
};