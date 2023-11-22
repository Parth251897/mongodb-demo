const ejs = require("ejs");
const moment = require("moment/moment");
const { StatusCodes } = require("http-status-codes");
const Admin = require("../../models/admin/Admin");
const Role = require("../../models/user/User");
const ResponseMessage = require("../../utils/Responsemessage.json");
const sendEmail = require("../../services/Emailservice");
const {
  passwordencrypt,
  validatePassword,
  sendResponse,
  handleError,
} = require("../../services/Commonservice");

exports.forgotPassword = async (req, res) => {
  const { email, roleType } = req.body;

  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = moment().add(2, "minutes");

    let role;
    if (roleType === "seller") {
      role = await Role.findOneAndUpdate(
        { email, role: "seller" },
        { $set: { otp: otp, otpExpiration: otpExpiration } },
        { new: true }
      );
      
    } else if (roleType === "user") {
      role = await Role.findOneAndUpdate(
        { email, role: "user" },
        { $set: { otp: otp, otpExpiration: otpExpiration } },
        { new: true }
      );
      
    } else if (roleType === "admin") {
      role = await Admin.findOneAndUpdate(
        { email,role: "admin" },
        { $set: { otp: otp, otpExpiration: otpExpiration } },
        { new: true }
      );
    }

    if (!role) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.NO_ACCOUNT_FOUND
      );
    } else {
      await role.save();
      const mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", {
        otpCode: otp,
      });
      await sendEmail(email, "Account Password Reset", mailInfo);
      return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_SENT);
    }
  } catch (error) {
    return handleError(res, error);
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user =
      (await Role.findOne({ email })) || (await Admin.findOne({ email }));

    if (!user) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.NO_ACCOUNT_FOUND
      );
    } else {
      if (Number(otp) !== user.otp) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.OTP_INVALID
        );
      } else {
        if (user.otpExpiration < moment())
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ResponseMessage.OTP_EXPARIE
          );
        else {
          await user.save();
          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.OTP_VERIFY_SUCCESSFULLY
          );
        }
      }
    }
  } catch (error) {
    return handleError(res, error);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!password || !confirmPassword || !email) {
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      ResponseMessage.FIELDS_REQUIRED
    );
  } else if (!validatePassword(password)) {
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      ResponseMessage.PASSWORD_FORMAT
    );
  } else {
    try {
      const user =
        (await Role.findOne({ email })) || (await Admin.findOne({ email }));

      if (!user) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          ResponseMessage.NO_ACCOUNT_FOUND
        );
      } else {
        if (password !== confirmPassword) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ResponseMessage.NEW_PASSWORD_CONFIRM_PASSWORD_NOT_MATCH
          );
        } else {
          const hashedPassword = await passwordencrypt(password);

          user.password = hashedPassword;
          user.otp = null;
          user.otpExpiration = null;
          await user.save();

          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.PASSWORD_RESET_SUCCESSFULLY
          );
        }
      }
    } catch (error) {
      return handleError(res, error);
    }
  }
};
