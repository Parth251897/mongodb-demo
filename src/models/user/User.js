const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user","seller"],
    },
    otp: Number,
    otpExpiration: Date,
  },
  { timestamps: true }
);

const user = new mongoose.model("user", UserSchema);
module.exports = user;
