const errorMessage = require("../error-message");

function chatLinks(message, chatManagment) {
  const { enabled, punish, time } = chatManagment;

  if (!enabled) return;

  const linksRegex = /((https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const discordInviteRegex = /(discord\.gg\/|discord\.com\/invite\/)/;

  if (discordInviteRegex.test(message.content)) return;

  if (linksRegex.test(message.content)) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      "You are not allowed to send links in this server!",
      punish,
      time
    );
  }
}

module.exports = chatLinks;
