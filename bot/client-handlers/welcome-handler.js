const dashboardSchema = require("../../schemas/dashboard-schema");
const botSchema = require("../../schemas/bot-schema");

async function welcomeHandler(member) {
  const dashboard = await dashboardSchema.findOne({ guildId: member.guild.id });

  if (!dashboard) {
    return null;
  }

  if (dashboard.welcomeGoodbye && dashboard.welcomeGoodbye.welcomeMessage) {
    const channelId = dashboard.welcomeGoodbye.welcomeMessage.channel;

    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) {
      return null;
    }

    let customMessage = dashboard.welcomeGoodbye.welcomeMessage.text;

    customMessage = customMessage.replace(/{user.mention}/g, `<@${member.id}>`);
    customMessage = customMessage.replace(/{user.tag}/g, member.user.tag);
    customMessage = customMessage.replace(
      /{user.username}/g,
      member.user.username
    );
    customMessage = customMessage.replace(/{user.id}/g, member.id);
    customMessage = customMessage.replace(/{server.name}/g, member.guild.name);
    customMessage = customMessage.replace(
      /{server.members}/g,
      member.guild.memberCount
    );

    await channel.send(customMessage);
  }
}

module.exports = welcomeHandler;
