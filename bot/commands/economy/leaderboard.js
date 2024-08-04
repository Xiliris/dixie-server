const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Show the top 10 users by total balance'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    try {
      const users = await guildUserSchema.find({ guildId: guildId });

      const sortedUsers = users
        .map(user => ({
          discordId: user.discordId,
          totalWealth: user.balance + user.bank,
          balance: user.balance,
          bank: user.bank
        }))
        .filter(user => user.totalWealth > 0)
        .sort((a, b) => b.totalWealth - a.totalWealth)
        .slice(0, 10);

      if (!sortedUsers.length) {
        return interaction.reply('No users found in the leaderboard.');
      }

      const leaderboard = sortedUsers.map((user, index) => {
        const position = index + 1;
        const emoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position;
        return `${emoji} - <@${user.discordId}>: **$${user.totalWealth}**`;
      }).join('\n');

      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setTitle('Leaderboard')
        .setDescription(leaderboard)
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('An error occurred while getting the leaderboard.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};