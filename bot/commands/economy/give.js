const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder().setName('give').setDescription('Give money from your bank to another user\'s bank')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to give money to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of money to give')
        .setRequired(true)
    ),
  async execute(interaction) {
    const senderId = interaction.user.id;
    const guildId = interaction.guild.id;
    const recipientUser = interaction.options.getUser('user');
    const recipientId = recipientUser.id;
    const amountToGive = interaction.options.getInteger('amount');

    if (amountToGive <= 0) {
      return interaction.reply('You must specify an amount greater than 0.');
    }

    try {
      const sender = await guildUserSchema.findOne({ discordId: senderId, guildId: guildId });
      const recipient = await guildUserSchema.findOne({ discordId: recipientId, guildId: guildId });

      if (!sender) {
        return interaction.reply('You dont have any money yet.');
      }

      if (sender.bank < amountToGive) {
        return interaction.reply('You do not have enough money in your bank to complete this transaction.');
      }

      if (!recipient) {
        recipient = new guildUserSchema({ discordId: recipientId, guildId: guildId });
      }

      sender.bank -= amountToGive;
      recipient.bank += amountToGive;

      await sender.save();
      await recipient.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You have successfully given $${amountToGive} to <@${recipientId}>.`)
        .addFields(
            { name: `<@${senderId}>`, value: `Your new bank balance: **$${sender.bank}**`, inline: false },
            { name: `<@${recipientId}>`, value: `${recipientUser.displayName}'s new bank balance: **$${recipient.bank}**`, inline: false }
          )
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while transacting.');
    }
  },
};