const jwt = require("jsonwebtoken");
require('dotenv').config();
const { SECRET_KEY } = process.env;

const options = {
  expiresIn: "24h",
};

async function generateToken(id, role) {
  const payload = { id, role };
  const token = jwt.sign(payload, SECRET_KEY, options);
  return token;
}

module.exports = {
  generateToken,
};
