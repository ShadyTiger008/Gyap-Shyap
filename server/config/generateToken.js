const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const secret = 'shady'
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  return jwt.sign({ id }, secret, {
    expiresIn: "30d"
  });
};

module.exports = generateToken;
