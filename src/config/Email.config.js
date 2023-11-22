require("dotenv").config();
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_API_KEY,
  },
});

module.exports = transporter;
