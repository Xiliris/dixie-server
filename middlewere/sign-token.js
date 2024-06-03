const jwt = require("../utils/jwt");
const mung = require("express-mung");

function signToken(body, req, res) {
  if (body.token) {
    body.token = jwt.signToken(body.token);
  }
  return body;
}

module.exports = mung.json(signToken);
