const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("lock").setDescription("Locks the chat"),
  
  async execute(interaction) {
    try {
      const everyoneRole = interaction.guild.roles.everyone;
      await interaction.channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: false,
      });
      await interaction.reply('Channel has been locked.');
    } catch (error) {
      console.error('Error locking the channel:', error);
      await interaction.reply('There was an error trying to lock the channel.');
    }
  },
};