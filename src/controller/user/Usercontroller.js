const { StatusCodes } = require("http-status-codes");
const Role = require("../../models/user/User");
const {
  handleError,
  sendResponse,
  validatePassword,
  passwordencrypt,
} = require("../../services/Commonservice");
const ResponseMessage = require("../../utils/Responsemessage.json");
const { generateToken } = require("../../utils/jwt");
var bcrypt = require("bcryptjs");

// user & seller create and update
exports.createUpdateRole = async (req, res) => {
  try {
    let { name, email, password, companyName,address, role } = req.body;

    if (req.body.id) {
      const updatedRole = await Role.findOneAndUpdate(
        { _id: req.body.id },
        { $set: req.body },
        { new: true }
      );
      const message =
        updatedRole.role === "user"
          ? ResponseMessage.USER_UPDATED
          : ResponseMessage.SELLER_UPDATED;
      return sendResponse(res, StatusCodes.CREATED, message, updatedRole);
    } else {
      if (!name || !email || !role || !address) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.FIELDS_REQUIRED
        );
      }
      if (role === "seller" && !companyName) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.COMPANYNAME_REQUIRED
        );
      }
      if (!validatePassword(password)) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.PASSWORD_FORMAT
        );
      }
      let existemail = await Role.findOne({
        email
      });
      if (existemail) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.EXISTEMAIL
        );
      } else {
        password = await passwordencrypt(password);
        email = email.toLowerCase();

        let newData = new Role({
          name,
          email,
          password,
          address,
          companyName,
          role: role,
        });

        newData
          .save()
          .then(async (data) => {
            const message =
              role === "user"
                ? ResponseMessage.USER_CREATED    
                : ResponseMessage.SELLER_CREATED;

            return sendResponse(res, StatusCodes.CREATED, message, newData);
          })
          .catch((error) => {
            return sendResponse(res, StatusCodes.BAD_REQUEST, `${error}`);
          });
      }
    }
  } catch (error) {
    return handleError(res, error);
  }
};

//user & seller login
exports.roleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const roles = await Role.find({ email });

    let role;
    if (roles.length === 1) {
      role = roles[0];
    } 
    else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.NO_ACCOUNT_FOUND
      );
    }
    if (!role.isActive) {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        ResponseMessage.NOT_ACTIVE
      );
    }

    const isValid = await bcrypt.compare(password, role.password);

    if (!isValid) {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        ResponseMessage.INVALID_PASSWORD
      );
    }

    const token = await generateToken(role._id, role.role);

    return sendResponse(
      res,
      StatusCodes.OK,
      `${
        role.role.charAt(0).toUpperCase() + role.role.slice(1)
      } login successfully`,
      { ...role._doc, token }
    );
  } catch (error) {
    return handleError(res, error);
  }
};

//user && seller change password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    if (!newPassword || !oldPassword) {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
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
        const user = await Role.findOne({
          _id: req.role.id,
        });
  
        if (!user) {
          return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            ResponseMessage.NOT_FOUND
          );
        } else {
          const isMatch = await bcrypt.compare(oldPassword, user.password);
  
          if (!isMatch) {
            return sendResponse(
              res,
              StatusCodes.BAD_REQUEST,
              ResponseMessage.WORNG_OLD_PASSWORD
            );
          } else {
            const isSamePassword = await bcrypt.compare(
              newPassword,
              user.password
            );
  
            if (isSamePassword) {
              return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.NEW_PASSWORD_DIFFERENT_FROM_OLD
              );
            } else {
              const hashedPassword = await passwordencrypt(
                newPassword,
                user.password
              );
              const Updateuser = await Role.findByIdAndUpdate(
                { _id: user._id },
                { $set: { password: hashedPassword } },
                { new: true }
              );
            }
            return sendResponse(
              res,
              StatusCodes.OK,
              ResponseMessage.PASSWORD_CHANGE_SUCCESSFULLY
            );
          }
        }
      } catch (error) {
        return handleError(res, error);
      }
    }
  };

// get details of current user && seller
exports.getDetails = async (req,res)=>{
  
    try {

    const data = await Role.find({id:req.role});
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GET_DETAILS_SUCCFULLY,
      data,
      
    );
  } catch (error) {
    return handleError(res, error);
  }
}


