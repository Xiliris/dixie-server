const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageCollector } = require('discord.js');
const axios = require('axios');
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flagtrivia')
    .setDescription('Guess the country by its flag to earn money'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    let country;
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data;
      country = countries[Math.floor(Math.random() * countries.length)];

    } catch (error) {
      console.error(error);
      return interaction.reply('Failed to fetch a flag. Please try again later.');
    }

    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setThumbnail(country.flags.png)
      .setDescription(`Guess the country of this flag:`)
      .setFooter({ text: 'Reply with the correct country name!' });

    await interaction.reply({ embeds: [embed] });

    const filter = response => response.author.id === userId;
    const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async message => {
      const userAnswer = message.content.toLowerCase();
      const correctAnswer = country.name.common.toLowerCase();

      if (userAnswer === correctAnswer) {
        let user = await guildUserSchema.findOne({ discordId: userId, guildId: guildId });
        if (!user) {
          user = new guildUserSchema({ discordId: userId, guildId: guildId, balance: 0, bank: 0 });
        }
        const reward = 200;
        user.balance += reward;
        await user.save();

        const correctEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
          .setDescription(`**Correct!** You've earned **$${reward}**. Your new balance is **$${user.balance}**.`);
        await interaction.followUp({ embeds: [correctEmbed] });
      } else {
        const incorrectEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
          .setDescription(`**Incorrect!** The correct answer was: **${country.name.common}**`);
        await interaction.followUp({ embeds: [incorrectEmbed] });
      }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
          const timeUpEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`Time is up! You didn\'t answer in time.\n Correct answer was: **${country.name.common}**`);
          interaction.followUp({ embeds: [timeUpEmbed] });
        }
      });
  },
};
