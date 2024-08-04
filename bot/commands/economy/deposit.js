const { SlashCommandBuilder } = require('@discordjs/builders');
const guildUserSchema = require("../../../schemas/guild-user-schema");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('deposit').setDescription('Deposit money into your bank')
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Amount to deposit')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const username = interaction.user.username;
    const amount = interaction.options.getInteger('amount');

    try {
      let user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });

      if (!user) {
        user = new guildUserSchema({
          discordId: userId,
          guildId: guildId,
          username: username,
          balance: 0,
          bank: 0,
        });
      }

      if (user.balance < amount) {
        return interaction.reply("You do not have enough balance to deposit this amount.");
      }

      user.balance -= amount;
      user.bank += amount;
      user.username = username;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`You have deposited $${amount} into your bank.`)
        .addFields(
          { name: 'Hand', value: `$${user.balance}`, inline: true },
          { name: 'Bank', value: `$${user.bank}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('An error occurred while depositing. Please try again later.')
        .setTimestamp()
        .setFooter({ text: 'Dixie Bot' });

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};