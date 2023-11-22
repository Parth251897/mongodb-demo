const express = require("express");
const AdminController = require("../../controller/admin/Admincontroller");
const router = express.Router();
const { auth, restrict } = require("../../middleware/Auth");
// const imageupload = require("../middleware/MultipleUpload");


//admin
router.post("/admin-login", AdminController.adminLogin);
router.post(
  "/admin-change-password",
  auth,
  restrict("admin"),
  AdminController.changePassword
);
router.get("/dashboard", auth, restrict("admin"), AdminController.dashBoard);
router.post(
  "/update-admin-profile",
  auth,
  restrict("admin"),
  AdminController.updateAdminProfile
);


module.exports = router;