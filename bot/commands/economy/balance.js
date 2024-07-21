const { SlashCommandBuilder } = require('@discordjs/builders');
const guildUserSchema = require("../../../schemas/guild-user-schema");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('balance').setDescription('Check users balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User for balance check')
        .setRequired(false)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.member;
    const userId = targetUser.id;
    const guild = interaction.guild;

    try {
      const user = await guildUserSchema.findOne({ discordId: userId });

      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setAuthor({name: targetUser.displayName, iconURL: targetUser.displayAvatarURL({ dynamic: true, size: 1024 })})
        .addFields(
          { name: 'User', value: `<@${userId}>`, inline: true},
          { name: 'Balance', value: `$${user ? user.balance : '0'}`, inline: true}
        )
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("An error occurred while getting the balance.");
    }
  },
};