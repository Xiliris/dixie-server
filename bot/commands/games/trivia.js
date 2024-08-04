const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageCollector } = require('discord.js');
const axios = require('axios');
const guildUserSchema = require("../../../schemas/guild-user-schema");


module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer trivia questions to earn money'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    let question;
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      question = response.data.results[0];
    } catch (error) {
      console.error(error);
      return interaction.reply('Failed to fetch a trivia question. Please try again later.');
    }

    const correctAnswer = question.correct_answer;
    const answers = [...question.incorrect_answers, correctAnswer].sort(() => Math.random() - 0.5);
    const letters = ['a', 'b', 'c', 'd'];

    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
      .setDescription(`**${question.question}**`)
      .addFields(answers.map((answer, index) => ({
        name: `Option ${letters[index]})`, value: answer, inline: false})))
      .setFooter({ text: 'Reply with the correct option letter!' });

    await interaction.reply({ embeds: [embed] });

    const filter = response => response.author.id === userId;
    const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async message => {
      const userAnswer = answers[letters.indexOf(message.content.toLowerCase())];
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
          .setDescription(`**Incorrect!** The correct answer was: **${correctAnswer}**`);
        await interaction.followUp({ embeds: [incorrectEmbed] });
      }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
          const timeUpEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`Time is up! You didn\'t answer in time.\n Correct answer was: **${correctAnswer}**`);
          interaction.followUp({ embeds: [timeUpEmbed] });
        }
      });
  },
};