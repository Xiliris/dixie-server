const errorMessage = require("../error-message");

function chatMassMention(message, chatManagment) {
  const { enabled, punish, time } = chatManagment;

  if (!enabled) return;

  const userMentions = message.mentions.users.size;
  const roleMentions = message.mentions.roles.size;
  const totalMentions = userMentions + roleMentions;

  if (totalMentions >= 3) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      "You are not allowed to metion more than 4 users in this server!",
      punish,
      time
    );
  }
}

module.exports = chatMassMention;
