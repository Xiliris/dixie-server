const { SlashCommandBuilder } = require('@discordjs/builders');
const guildUserSchema = require("../../../schemas/guild-user-schema");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('balance').setDescription('Check user\'s balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User for balance check')
        .setRequired(false)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;
    const guildId = interaction.guild.id;

    try {
      const user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });

      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setAuthor({ name: targetUser.displayName, iconURL: targetUser.displayAvatarURL({ dynamic: true, size: 1024 }) })
        .addFields(
          { name: 'Hand', value: `$${user ? user.balance : '0'}`, inline: true },
          { name: 'Bank', value: `$${user ? user.bank : '0'}`, inline: true },
          { name: 'Total', value: `$${user ? (user.balance + user.bank) : '0'}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('An error occurred while getting the balance.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};