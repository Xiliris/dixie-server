const botSchema = require("../../schemas/bot-schema");
const dashboard = require("../../schemas/dashboard-schema");

async function guildSave(client, guild) {
  const guildId = guild.id;
  if (!guildId) {
    return null;
  }

  const bot = await botSchema.findOne({ clientId: client.user.id });

  if (bot && bot.guildId !== guildId) {
    guild.leave();
    return;
  }

  await dashboard.findOneAndUpdate(
    {
      guildId,
    },
    {
      guildId,
    },
    {
      upsert: true,
    }
  );
}

async function guildDelete(guildId) {
  if (!guildId) {
    return null;
  }

  await dashboard.findOneAndDelete({
    guildId,
  });
}

async function clientSave(guildId, clientId, token) {
  if (!guildId || !clientId || !token) {
    return null;
  }

  await botSchema.findOneAndUpdate(
    {
      guildId,
    },
    {
      guildId,
      clientId,
      token,
    },
    {
      upsert: true,
    }
  );
}

module.exports = { guildSave, clientSave, guildDelete };
