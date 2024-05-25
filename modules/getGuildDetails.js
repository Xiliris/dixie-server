const client = require("../bot/index");

function getGuildDetails(guildId) {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    return null;
  }

  return guild;
}

module.exports = getGuildDetails;
