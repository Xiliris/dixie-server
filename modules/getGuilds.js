require("dotenv").config();
const axios = require("axios");
const userSchema = require("../schemas/user-schema");
const refreshToken = require("./refreshToken");
const { redisClient } = require("../database/loadRedisDatabase");

async function getGuilds(accessToken) {
  try {
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
