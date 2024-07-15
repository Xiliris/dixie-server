const errorMessage = require("../error-message");

function blacklistedWords(message, chatManagment) {
  let { enabled, punish, time, blacklisted } = chatManagment;

  if (!enabled) return;
  blacklisted = blacklisted.map((word) => word.toLowerCase());

  let foundWord = false;

  const words = message.content.split(" ").map((word) => word.toLowerCase());

  for (const word of words) {
    if (blacklisted.includes(word)) {
      foundWord = true;
      break;
    }
  }

  if (foundWord) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      `You are not allowed to use blacklisted words in this server!\n words: ${blacklisted.join(
        ", "
      )}`,
      punish,
      time
    );
  }
}

module.exports = blacklistedWords;
