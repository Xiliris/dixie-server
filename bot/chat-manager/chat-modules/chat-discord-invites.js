const errorMessage = require("../error-message");

function chatDiscordInvite(message, chatManagment) {
  const { enabled, punish, time } = chatManagment;

  if (!enabled) return;

  const discordInviteRegex = /(discord\.gg\/|discord\.com\/invite\/)/;

  if (discordInviteRegex.test(message.content)) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      "You are not allowed to send discord invite links in this server!",
      punish,
      time
    );
  }
}

module.exports = chatDiscordInvite;
