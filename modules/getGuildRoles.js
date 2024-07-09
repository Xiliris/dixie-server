const client = require("../bot/index");

function getGuildRoles(guildId) {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    console.log(`Guild with ID ${guildId} not found.`);
    return;
  }

  const roles = guild.roles.cache;

  const roleList = roles.map((role) => {
    return {
      id: role.id,
      name: role.name,
    };
  });

  return roleList;
}

module.exports = getGuildRoles;
