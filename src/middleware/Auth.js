const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const ResponseMessage = require("../utils/Responsemessage.json");
const { sendResponse,handleError } = require("../services/Commonservice");
require('dotenv').config();

const auth = async (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return sendResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      ResponseMessage.TOKEN_NOT_AUTHORIZED
    );
  } else {
    try {
      const decode = await jwt.verify(token, process.env.SECRET_KEY);
      req.role = decode;
      next();
    } catch (error) {
      return handleError(res, error);
    }
  }
};

const restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role.role)) {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        `Role : ${req.role.role} is not allowed to access this resources`
      );
    }

    next();
  };
};

module.exports = { auth, restrict };
