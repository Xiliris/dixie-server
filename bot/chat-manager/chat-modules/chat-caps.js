const errorMessage = require("../error-message");

function chatCaps(message, chatManagment) {
  const { enabled, punish, time } = chatManagment;

  if (!enabled) return;

  const capsRegex = /[A-Z]/g;
  const totalLength = message.content.length;
  const capsMatches = message.content.match(capsRegex) || [];
  const capsLength = capsMatches.length;
  const capsRatio = capsLength / totalLength;

  if (totalLength > 5 && capsRatio > 0.7) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      "You are not allowed to send messages with caps in this server!",
      punish,
      time
    );
  }
}

module.exports = chatCaps;
