const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('work').setDescription('Earn money by working.'),
  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      let user = await guildUserSchema.findOne({ discordId: userId });
      if (!user) {
        user = new guildUserSchema({ discordId: userId });
      }

      const workReward = Math.floor(Math.random() * (300 - 80 + 1)) + 80;

      user.balance += workReward;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Work Success')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You earned **$${workReward}** from working!\n Your new balance is **$${user.balance}**.`)
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while processing your work command.');
    }
  },
};