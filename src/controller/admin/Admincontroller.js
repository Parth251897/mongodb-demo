var bcrypt = require("bcryptjs");
const Admin = require("../../models/admin/Admin");
const {
  passwordencrypt,
  validatePassword,
  handleError,
  sendResponse,
} = require("../../services/Commonservice");
const { StatusCodes } = require("http-status-codes");
const ResponseMessage = require("../../utils/Responsemessage.json");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../utils/jwt");

const Role = require("../../models/user/User");
const product = require("../../models/products/product");
// const Category = require('../../models/category');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.NOT_ADMIN
      );
    } else {
      const isValid = await bcrypt.compare(password, admin.password);

      if (!isValid) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          ResponseMessage.WORNG_PASSWORD
        );
      } else {
        const token = await generateToken(admin._id, "admin");
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.ADMIN_LOGIN_SUCCESSFULLY,
          { ...admin._doc, token }
        );
      }
    }
  } catch (error) {
    return handleError(res, error);
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!newPassword || !oldPassword) {
    return sendResponse(
      res,
      StatusCodes.FORBIDDEN,
      ResponseMessage.ALL_REQUIRED
    );
  } else if (!validatePassword(newPassword)) {
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      ResponseMessage.PASSWORD_FORMAT
    );
  } else {
    try {
      const admin = await Admin.findOne({ _id: req.role.id });

      if (!admin) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          ResponseMessage.NOT_ADMIN
        );
      } else {
        const isMatch = await bcrypt.compare(oldPassword, admin.password);

        if (!isMatch) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ResponseMessage.WORNG_OLD_PASSWORD
          );
        } else {
          const isSamePassword = await bcrypt.compare(
            newPassword,
            admin.password
          );

          if (isSamePassword) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              ResponseMessage.NEW_PASSWORD_DIFFERENT_FROM_OLD
            );
          } else {
            const hashedPassword = await passwordencrypt(newPassword);
            const Updateadmin = await Admin.findByIdAndUpdate(
              { _id: admin._id },
              { $set: { password: hashedPassword } },
              { new: true }
            );
          }
          return sendResponse(
            res,
            StatusCodes.CREATED,
            ResponseMessage.PASSWORD_CHANGE_SUCCESSFULLY
          );
        }
      }
    } catch (error) {
      return handleError(res, error);
    }
  }
};

exports.dashBoard = async (req, res) => {
  try {
    const userCount = await Role.countDocuments({ role: "user" });
    const sellerCount = await Role.countDocuments({ role: "seller" });
    const categoriesCount = await product.countDocuments({ isDeleted: false });

    const counts = {
      userCount,
      sellerCount,
      categoriesCount,
    };
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.DESHBOARD_COUNT,
      counts
    );
  } catch (err) {
    return handleError(res, err);
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    let adminDetails = await Admin.findByIdAndUpdate(
      { _id: req.role.id },
      { $set: { name, email } },
      { new: true }
    );

    if (!adminDetails) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.ADMIN_NOT_UPDATE
      );
    }

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.ADMIN_UPDATE,
      adminDetails
    );
  } catch (error) {
    return handleError(res, error);
  }
};
