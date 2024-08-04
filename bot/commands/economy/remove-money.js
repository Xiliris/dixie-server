const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('removemoney').setDescription('Remove amount from user\'s balance or bank')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove balance from')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount to remove')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('target')
        .setDescription('Specify where to remove money from (hand or bank)')
        .setRequired(true)
        .addChoices(
          { name: 'Hand', value: 'balance' },
          { name: 'Bank', value: 'bank' }
        )
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('You don\'t have permission to use this command.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const amountToRemove = interaction.options.getInteger('amount');
    const target = interaction.options.getString('target');
    const userId = targetUser.id;
    const guildId = interaction.guild.id;

    try {
      let user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });

      if (!user) {
        user = new guildUserSchema({ discordId: userId, guildId: guildId });
      }

      if (target === 'balance') {
        user.balance = Math.max(0, user.balance - amountToRemove);
      } else if (target === 'bank') {
        user.bank = Math.max(0, user.bank - amountToRemove);
      }

      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#FFFF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setAuthor({ name: targetUser.displayName, iconURL: targetUser.displayAvatarURL({ dynamic: true, size: 1024 }) })
        .setDescription(`Successfully removed $${amountToRemove} from <@${userId}>'s ${target}.`)
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('An error occurred while removing money.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};