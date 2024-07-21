const { SlashCommandBuilder } = require("discord.js");
const guildUserSchema = require("../../../schemas/guild-user-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`warn`)
    .setDescription(`Warn a user`)
    .addUserOption((option) =>
      option.setName(`user`).setDescription("User for warn").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(`reason`)
        .setDescription("Reason for warn")
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

    const targetUser = interaction.options.getUser("user");
    const targetId = targetUser.id;
    const reason = interaction.options.getString("reason");

    const guildId = interaction.guild.id;

    const warning = {
      author: interaction.user.id,
      timestamp: new Date().getTime(),
      reason,
    };

    try {
      /* DATABASE UPDATE */
      await guildUserSchema.findOneAndUpdate(
        {
          userId: targetId,
          guildId,
        },
        {
          userId: targetId,
          guildId,
          $push: {
            warnings: warning,
          },
        },
        {
          upsert: true,
        }
      );

      interaction.reply(`Warned <@${targetId}> for "${reason}"`);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  },
};
