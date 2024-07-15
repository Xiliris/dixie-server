const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Nuke a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to be nuked")
        .setRequired(false)
    ),
  async execute(interaction) {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    if (!channel) {
      await interaction.reply("Channel not found!");
      return;
    }

    if (!channel.isTextBased()) {
      await interaction.reply("Channel must be a text channel!");
      return;
    }

    const position = channel.position;
    const reason = "Nuked by " + interaction.user.tag;

    try {
      await channel.delete(reason);

      const newChannel = await channel.clone(reason);
      await newChannel.setPosition(position);

      const nukedEmbed = new EmbedBuilder()
        .setTitle("Channel Nuked")
        .setDescription(`Channel has been nuked by ${interaction.user.tag}`)
        .setColor("#ff0000")
        .setThumbnail("https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif")
        .setTimestamp();

      await newChannel.send({ embeds: [nukedEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error trying to nuke the channel!");
      return;
    }
  },
};
