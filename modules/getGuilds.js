require("dotenv").config();
const redisClient = require("../database/loadRedisDatabase").redisClient;
const axios = require("axios");
const userSchema = require("../schemas/user-schema");
const refreshToken = require("./refreshToken");

async function getGuilds(accessToken) {
  try {
    const cachedUser = await redisClient.get(`guilds:${accessToken}`);

    if (cachedUser) {
      return {
        guilds: JSON.parse(cachedUser).guilds,
        token: accessToken,
      };
    }

    const user = await userSchema.findOne({
      access_token: accessToken,
    });

    if (!user) {
      return null;
    }

    const { data, status } = await axios.get(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          authorization: `Bearer ${user.access_token}`,
        },
      }
    );

    if (status === 401) {
      getGuilds(await refreshToken(user.refresh_token));
    }

    redisClient.setEx(
      `guilds:${user.access_token}`,
      3600,
      JSON.stringify({ guilds: data })
    );

    return {
      guilds: data,
      token: user.access_token,
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = getGuilds;
