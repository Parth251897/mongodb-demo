const express = require("express");
const router = express.Router();
const RoleController= require("../../controller/user/Usercontroller");
const {auth, restrict } = require("../../middleware/Auth")

// auth route

router.post('/create-update-role',RoleController.createUpdateRole)
router.post('/role-login',RoleController.roleLogin)
router.post('/role-change-password',auth,restrict("user", "seller"),RoleController.changePassword)
router.get('/getDetails',auth,restrict("user", "seller"),RoleController.getDetails)



module.exports = router