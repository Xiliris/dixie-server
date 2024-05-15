const clientLogin = require("./client-login");
const botSchema = require("../schemas/bot-schema");

function logAllClients() {
  botSchema.find().then((results) => {
    for (const result of results) {
      clientLogin(result.token);
    }
  });
}

module.exports = logAllClients;
