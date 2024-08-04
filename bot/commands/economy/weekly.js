const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('weekly').setDescription('Claim your weekly bonus'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const now = new Date();
    const weeklyBonus = 500;

    try {
      let user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });

      if (!user) {
        user = new guildUserSchema({ discordId: userId, guildId: guildId, balance: weeklyBonus, lastWeekly: now });
      } else {
        const lastWeekly = user.lastWeekly ? new Date(user.lastWeekly) : new Date(0);
        const diffTime = Math.abs(now - lastWeekly);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60 * 7));

        if (diffHours < 168) {
          const timeLeft = 168 - diffHours;
          const timeEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`You have already claimed your weekly bonus. Please wait ${timeLeft} hour(s) to claim again.`);
          return interaction.reply({ embeds: [timeEmbed], ephemeral: true });
        }

        user.balance += weeklyBonus;
        user.lastWeekly = now;
      }

      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You have claimed your weekly bonus of **$${weeklyBonus}**.\n Your new balance is **$${user.balance}**.`)
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription('An error occurred while claiming your weekly bonus.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};