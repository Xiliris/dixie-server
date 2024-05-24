const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const botSchema = require("../../schemas/bot-schema");
const { redisClient } = require("../../database/loadRedisDatabase");

async function clientApperence(client) {
  const apperence = await botSchema.findOne({ clientId: client.user.id });

  const rateBlocked = await redisClient.get(`rate-blocked-${client.user.id}`);

  if (rateBlocked) {
    return false;
  }

  await redisClient.setEx(`rate-blocked-${client.user.id}`, 300, "true");

  if (!apperence) {
    return false;
  }

  try {
    const currentUsername = client.user.username;

    client.user.setPresence({
      activities: [
        {
          name: apperence.activity,
          type: ActivityType[apperence.activityType],
        },
      ],
      status: PresenceUpdateStatus[apperence.status],
    });

    if (currentUsername !== apperence.name) {
      client.user.setUsername(apperence.name);
    }

    if (apperence.avatar) {
      client.user.setAvatar(`storage/avatars/${apperence.avatar}`);
    }

    return true;
  } catch (err) {
    return;
  }
}

module.exports = clientApperence;
