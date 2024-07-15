const errorMessage = require("../error-message");

const userMessages = new Map();
const calmDownUser = new Map();

async function chatSpam(message, chatManagment) {
  const { enabled, punish, time } = chatManagment;

  if (!enabled) return;

  const userId = message.author.id;
  const currentTime = Date.now();

  if (calmDownUser.has(userId)) {
    message.delete().catch((err) => console.error(err));
    return;
  }

  if (!userMessages.has(userId)) {
    userMessages.set(userId, { count: 1, lastMessageTime: currentTime });
    return;
  }

  const userData = userMessages.get(userId);
  const timeDifference = currentTime - userData.lastMessageTime;

  if (timeDifference < 2000) {
    userData.count++;

    if (userData.count >= 3) {
      await message.delete();

      errorMessage(
        message,
        "You are not allowed to spam in this server!",
        punish,
        time
      );

      calmDownUser.set(userId, true);
      setTimeout(() => {
        calmDownUser.delete(userId);
      }, 5000);

      userMessages.set(userId, { count: 0, lastMessageTime: currentTime });
    } else {
      userMessages.set(userId, {
        count: userData.count,
        lastMessageTime: currentTime,
      });
    }
  } else {
    userMessages.set(userId, { count: 1, lastMessageTime: currentTime });
  }
}

module.exports = chatSpam;
