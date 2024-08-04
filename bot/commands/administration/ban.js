const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName("ban").setDescription("Ban a user")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for ban')
        .setRequired(false)
    ),
  async execute(interaction) {
    if (
      !(
        interaction.member.permissions.has("BanMembers") ||
        interaction.member.permissions.has("Administrator")
      )
    ) {
      return interaction.reply(
        "You do not have permission to use this command."
      );
    }

    const targetUser = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const dmEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('You Have Been Banned')
      .setThumbnail("https://cdn.discordapp.com/attachments/401105032029667328/1265144628701692035/dixie.png?ex=66a07140&is=669f1fc0&hm=f5019a256418efe59917bf0258c985ab124a706bd128edfdf2c3f5f9573bb092&")
      .setDescription(`You have been banned from ${interaction.guild.name}`)
      .addFields({ name: 'Reason', value: reason })
      .setFooter({ text: 'If you believe this was a mistake, please contact an admin.' });

    try {
      await targetUser.send({ embeds: [dmEmbed] });

      await interaction.guild.members.ban(targetUser.id, { reason });

      await interaction.reply(`User <@${targetUser.id}> has been banned! Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      await interaction.reply(`Failed to ban user <@${targetUser.id}>. Please try again.`);
    }
  },
};