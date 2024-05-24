const client = require("../bot/index");

function getGuildChannels(guildId) {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    console.log(`Guild with ID ${guildId} not found.`);
    return;
  }

  const channels = guild.channels.cache;

  const textChannels = channels.filter((channel) => channel.type === 0);

  const channelList = textChannels.map((channel) => {
    return {
      id: channel.id,
      name: channel.name,
    };
  });

  return channelList;
}

module.exports = getGuildChannels;
