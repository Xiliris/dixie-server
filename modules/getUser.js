require("dotenv").config();
const axios = require("axios");
const userSchema = require("../schemas/user-schema");
const refreshToken = require("./refreshToken");

async function getUser(accessToken) {
  try {
    const user = await userSchema.findOne({
      access_token: accessToken,
    });

    if (!user) {
      return null;
    }

    const { data, status } = await axios.get(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          authorization: `Bearer ${user.access_token}`,
        },
      }
    );

    if (status === 401) {
      getUser(await refreshToken(user.refresh_token));
    }

    return {
      user: data,
      token: user.access_token,
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = getUser;
