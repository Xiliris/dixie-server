const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema({
  discordId: reqString,
  access_token: reqString,
  refresh_token: reqString,
});

module.exports = mongoose.model("user", userSchema);
