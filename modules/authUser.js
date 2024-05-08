require("dotenv").config();
const axios = require("axios");
const userSchema = require("../schemas/user-schema");

const { CLIENT_ID, CLIENT_SECRET, CLIENT_REDIRECT } = process.env;

async function authUser(code) {
  if (!code) {
    throw new Error("Missing code query parameter");
  }

  const formData = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code.toString(),
    redirect_uri: CLIENT_REDIRECT,
  };

  try {
    const response = await axios.post(
      "https://discord.com/api/v10/oauth2/token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, token_type, refresh_token } = response.data;

    const userResponse = await axios.get(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          authorization: `${token_type} ${access_token}`,
        },
      }
    );

    const discordId = userResponse.data.id;

    await userSchema.findOneAndUpdate(
      { discordId },
      { discordId, access_token, refresh_token },
      { upsert: true }
    );

    return access_token;
  } catch (error) {
    console.error("Error during authentication:", error.response.data);
    throw new Error("Authentication failed");
  }
}

module.exports = authUser;
