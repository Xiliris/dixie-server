const { EmbedBuilder } = require("discord.js");

function errorMessage(message, errorMessage, punish, time) {
  const timeMessage = time === 0 ? "Forever" : `${time} minutes`;

  if (!message || !errorMessage || !punish || !timeMessage) {
    if (!message) console.error("Invalid message object.");
    if (!errorMessage) console.error("Invalid error message.");
    if (!punish) console.error("Invalid punishment.");
    if (!time) console.error("Invalid time.");
    return;
  }
  if (!message.guild || !message.author) {
    console.error("Invalid message object.");
    return;
  }

  const errorEmbed = new EmbedBuilder()
    .setTitle(message.guild.name)
    .setThumbnail(message.guild.iconURL())

    .addFields(
      { name: "Punishment", value: punish, inline: true },
      { name: "Time", value: timeMessage, inline: true },
      { name: "Reason", value: errorMessage }
    )
    .setColor("#ff0000");

  message.author.send({ embeds: [errorEmbed] }).catch((error) => {
    console.error(`Failed to send DM to ${message.author.tag}:`, error);
  });
}

module.exports = errorMessage;
