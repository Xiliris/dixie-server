const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily bonus'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const now = new Date();
    const dailyBonus = 100;

    try {
      let user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });

      if (!user) {
        user = new guildUserSchema({ discordId: userId, guildId: guildId, balance: dailyBonus, lastDaily: now });
      } else {
        const isAdmin = interaction.member.permissions.has('Administrator');
        const lastDaily = user.lastDaily ? new Date(user.lastDaily) : new Date(0);
        const diffTime = Math.abs(now - lastDaily);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        if (!isAdmin && diffHours < 24) {
          const timeLeft = 24 - diffHours;
          const timeEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`You have already claimed your daily bonus.\n Please wait ${timeLeft} hour(s) to claim again.`)
            .setTimestamp()
            .setFooter({ text: 'Dixie Bot' });

          return interaction.reply({ embeds: [timeEmbed], ephemeral: true });
        }

        user.balance += dailyBonus;
        user.lastDaily = now;
      }

      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You have claimed your daily bonus of **$${dailyBonus}**.\n Your new balance is **$${user.balance}**.`)
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription('An error occurred while claiming your daily bonus.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
