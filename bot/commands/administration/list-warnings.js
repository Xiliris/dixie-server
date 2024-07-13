const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-warnings")
    .setDescription("list user infractions")
    .addUserOption((option) =>
      option
        .setName(`user`)
        .setDescription("User for infractions")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !(
        interaction.member.permissions.has("KICK_MEMBERS") ||
        interaction.member.permissions.has("BAN_MEMBERS") ||
        interaction.member.permissions.has("ADMINISTRATOR")
      )
    ) {
      return interaction.reply(
        "You do not have permission to use this command"
      );
    }

    const target = interaction.options.getUser("user");
    const guildId = interaction.guild.id;

    /* DATABASE FIND */
    try {
      const result = await guildUserSchema.findOne({
        userId: target.id,
        guildId,
      });

      if (!result || !result.warnings.length) {
        return interaction.reply("No infractions found");
      }

      const infractionsEmbed = new EmbedBuilder()
        .setTitle(`Total Infractions: *${result.warnings.length}*`)
        .setAuthor({
          name: target.globalName,
          iconURL: target.displayAvatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(interaction.guild.iconURL());

      result.warnings.map((warning, index) =>
        infractionsEmbed.addFields({
          name: `**Infraction *${index + 1}***`,
          value: `**Admin:** <@${warning.author}>\n**Date:** ${new Date(
            warning.timestamp
          ).toLocaleDateString()}\n**Reason:** ${warning.reason}`,
        })
      );

      interaction.reply({ embeds: [infractionsEmbed] });
    } catch (error) {
      console.error("Error finding database:", error);
    }
  },
};
