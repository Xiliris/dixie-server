const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('lottery').setDescription('Buy a lottery ticket'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const ticketPrice = 50;

    try {
      let user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });

      if (!user || user.balance < ticketPrice) {
        const noMoneyEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('You do not have enough money to buy a lottery ticket.')
          .setTimestamp()
          .setFooter({ text: 'Dixie Bot' });

        return interaction.reply({ embeds: [noMoneyEmbed], ephemeral: true });
      }

      user.balance -= ticketPrice;
      await user.save();

      const prize = Math.random() < 0.05 ? 1000 : 0;
      if (prize > 0) {
        user.balance += prize;
        await user.save();

        const winEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
          .setDescription(`Congratulations! You won **$${prize}**. Your new balance is **$${user.balance}**.`)
          .setTimestamp()
          .setFooter({ text: 'Dixie Bot' });

        await interaction.reply({ embeds: [winEmbed] });
      } else {
        const loseEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
          .setDescription('Sorry, you did not win the lottery this time.')
          .setTimestamp()
          .setFooter({ text: 'Dixie Bot' });

        await interaction.reply({ embeds: [loseEmbed] });
      }
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription('An error occurred while processing the lottery.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};