const jwt = require("jsonwebtoken");

function signToken(accessToken) {
  try {
    const jwtToken = jwt.sign({ accessToken }, process.env.JWT_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    return jwtToken;
  } catch (error) {
    console.error("Error during signing:", error);
    return null;
  }
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY, {
      algorithms: ["RS256"],
    });
    return decoded;
  } catch (error) {
    console.error("Error during verification:", error);
    return null;
  }
}

module.exports = { signToken, verifyToken };
