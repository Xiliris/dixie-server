const { Collection } = require("discord.js");
const errorMessage = require("../error-message");

const userMessages = new Collection();
const REPEATED_TIME_WINDOW = 10 * 1000;

function chatRepeatedMessages(message, chatManagment) {
  const { enabled, punish, time } = chatManagment;

  if (!enabled) return;

  const userId = message.author.id;
  const messageContent = message.content.toLowerCase();
  const timestamp = message.createdTimestamp;

  if (!userMessages.has(userId)) {
    userMessages.set(userId, []);
  }

  let userMessageData = userMessages.get(userId);
  userMessageData.push({ content: messageContent, timestamp });

  const cutoffTime = timestamp - REPEATED_TIME_WINDOW;
  userMessageData = userMessageData.filter(
    (data) => data.timestamp > cutoffTime
  );
  userMessages.set(userId, userMessageData);

  const repeatedMessage = userMessageData.filter(
    (data) => data.content === messageContent
  ).length;

  if (repeatedMessage > 1) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      "You are not allowed to send repeated messages in this server!",
      punish,
      time
    );
  }
}

module.exports = chatRepeatedMessages;
