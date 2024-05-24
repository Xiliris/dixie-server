const clientLogin = require("../client-modules/client-login");
const botSchema = require("../../schemas/bot-schema");

function logAllClients() {
  botSchema.find().then((results) => {
    for (const result of results) {
      if (result.token) {
        clientLogin(result.token);
      }
    }
  });
}

module.exports = logAllClients;
