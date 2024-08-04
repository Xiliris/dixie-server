const { SlashCommandBuilder } = require('@discordjs/builders');
const guildUserSchema = require("../../../schemas/guild-user-schema");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob money from another user\'s balance')
    .addUserOption(option => 
      option.setName('target')
        .setDescription('The user you want to rob')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const targetUser = interaction.options.getUser('target');

    if (targetUser.id === userId) {
      return interaction.reply({ content: "You cannot rob yourself!", ephemeral: true });
    }

    try {
      const user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });
      const target = await guildUserSchema.findOne({ discordId: targetUser.id, guildId: guildId });

      if (!user) {
        return interaction.reply({ content: "You have to make some money before you can rob.", ephemeral: true });
      }

      if (!target || target.balance <= 0) {
        return interaction.reply({ content: "The target user has no money to rob.", ephemeral: true });
      }

      const maxRobAmount = Math.min(target.balance, 100);
      const robAmount = Math.floor(Math.random() * maxRobAmount) + 1;

      target.balance -= robAmount;
      user.balance += robAmount;
      await target.save();
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You have robbed $${robAmount} from ${targetUser.displayName}.`)
        .addFields(
          { name: 'Your Balance', value: `$${user.balance}`, inline: true },
          { name: `${targetUser.displayName}'s Balance`, value: `$${target.balance}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('An error occurred while robbing. Please try again later.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};