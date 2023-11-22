require("dotenv").config();
const transporter = require("../config/Email.config");

const sendEmail = async (email, subject, body) => {
  try {
    return new Promise((resolve, reject) => {
      const mailing = {
        from: process.env.EMAIL_USER_FROM,
        to: email,
        subject: subject,
        html: body,
      };
      transporter.sendMail(mailing, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};
module.exports = sendEmail;
