const express = require("express");
const router = express.Router();
const CommonController = require("../../controller/common/Commoncontroller");



router.post("/forgot-password", CommonController.forgotPassword);
router.post("/verify-otp", CommonController.verifyOtp);
router.post("/reset-password", CommonController.resetPassword);

module.exports = router;
