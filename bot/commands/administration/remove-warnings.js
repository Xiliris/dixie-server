const { SlashCommandBuilder } = require("discord.js");
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`remove-warning`)
    .setDescription(`Remove a warning from a user`)
    .addUserOption((option) =>
      option
        .setName(`user`)
        .setDescription("User to remove warning")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(`index`)
        .setDescription("Index of the warning to remove")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !(
        interaction.member.permissions.has("KickMembers") ||
        interaction.member.permissions.has("BanMembers") ||
        interaction.member.permissions.has("Administrator")
      )
    ) {
      return interaction.reply(
        "You do not have permission to use this command."
      );
    }

    console.log("remove-warning command executed");
    const targetUser = interaction.options.getUser("user");
    const warnIndex = parseInt(interaction.options.getString("index"));
    const guildId = interaction.guild.id;

    if (isNaN(warnIndex) || warnIndex < 1) {
      return interaction.reply("Invalid warning index");
    }

    try {
      /* DATABASE FIND */
      const result = await guildUserSchema.findOne({
        userId: targetUser.id,
        guildId,
      });

      if (
        !result ||
        !result.warnings.length ||
        result.warnings.length < warnIndex
      ) {
        return interaction.reply("No infractions found");
      }

      /* DATABASE UPDATE */
      const foundWarning = result.warnings[warnIndex - 1];

      await guildUserSchema.updateOne(
        {
          userId: targetUser.id,
          guildId,
        },
        {
          $pull: {
            warnings: foundWarning,
          },
        }
      );

      interaction.reply(
        `Removed warning for <@${targetUser.id}>: "${foundWarning.reason}"`
      );
    } catch (error) {
      console.error("Error updating database:", error);
    }
  },
};
