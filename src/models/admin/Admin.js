const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "admin"
    },
    otp: Number,
    otpExpiration:Date,
  },
  { timestamps: true }
);

const admin = new mongoose.model("admin", AdminSchema);
module.exports = admin;