require("dotenv").config();
const axios = require("axios");
const userSchema = require("../schemas/user-schema");

const { CLIENT_ID, CLIENT_SECRET } = process.env;

async function refreshToken(refreshToken) {
  const formData = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const resposne = await axios.post(
    "https://discord.com/api/v10/oauth2/token",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, refresh_token } = resposne.data;

  await userSchema.findOneAndUpdate(
    {
      discordId: user.data.id,
    },
    {
      discordId: user.data.id,
      access_token,
      refresh_token,
    },
    {
      upsert: true,
    }
  );

  return access_token;
}

module.exports = refreshToken;
