const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("kick").setDescription("Kick a user").addUserOption(option =>
    option.setName('user')
        .setDescription('User to kick')
        .setRequired(true)),
  async execute(interaction) {
    if (
      !(
        interaction.member.permissions.has("KickMembers") ||
        interaction.member.permissions.has("Administrator")
      )
    ) {
      return interaction.reply(
        "You do not have permission to use this command."
      );
    }
    const targetUser = interaction.options.getUser("user")
    console.log(targetUser)
    await interaction.reply(`User <@${targetUser.id}> has been kicked from the server!`);
  },
};