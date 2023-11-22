const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const ResponseMessage = require("../utils/Responsemessage.json");
require('dotenv').config();

async function passwordencrypt(password) {
  let salt = await bcrypt.genSalt(10);
  let passwordHash = bcrypt.hash(password, salt);
  return passwordHash;
}


function validatePassword(password) {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
  return pattern.test(password);
}

async function handleError(res, error) {
  return res.status(500).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ResponseMessage.INTERNAL_SERVER_ERROR,
    data: error.message,
  });
}

async function sendResponse(res, statusCode, message, data = []) {
  return res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: data || [],
  });
}

module.exports = {
  passwordencrypt,
  validatePassword,
  handleError,
  sendResponse,
};
