const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("unlock").setDescription("Unlocks the chat"),
  
  async execute(interaction) {
    try {
      const everyoneRole = interaction.guild.roles.everyone;
      await interaction.channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: true,
      });
      await interaction.reply('Channel has been unlocked.');
    } catch (error) {
      console.error('Error unlocking the channel:', error);
      await interaction.reply('There was an error trying to unlock the channel.');
    }
  },
};