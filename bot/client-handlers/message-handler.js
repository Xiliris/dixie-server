const chatManagment = require("../chat-manager/chat-managment");
async function messageHandler(client, message) {
  chatManagment(client, message);
}

module.exports = messageHandler;
