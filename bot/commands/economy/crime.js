const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('crime').setDescription('Earn money by making crimes.'),
  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      let user = await guildUserSchema.findOne({ discordId: userId });
      if (!user) {
        user = new guildUserSchema({ discordId: userId });
      }

      const crimeReward = Math.floor(Math.random() * (700 - 80 + 1)) + 80;

      user.balance += crimeReward;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You earned **$${crimeReward}** from crime!\n\n Your new balance is **$${user.balance}**.`)
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while processing your crime command.');
    }
  },
};