const { verifyToken } = require("../utils/jwt");
function authToken(req, res, next) {
  const { token } = req.headers;

  if (token) {
    req.headers.token = verifyToken(token).accessToken;
  }

  next();
}

module.exports = authToken;
