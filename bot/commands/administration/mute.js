const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("mute").setDescription("Mute a user").addUserOption(option =>
    option.setName('user')
        .setDescription('User to mute')
        .setRequired(true)),
  async execute(interaction) {
    if (
      !(
        interaction.member.permissions.has("MuteMembers") ||
        interaction.member.permissions.has("Administrator")
      )
    ) {
      return interaction.reply(
        "You do not have permission to use this command."
      );
    }
    const targetUser = interaction.options.getUser("user")
    console.log(targetUser)
    await interaction.reply(`User <@${targetUser.id}> has been muted!`);
  },
};