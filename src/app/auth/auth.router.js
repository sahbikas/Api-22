//const express = require("express")
//const router = express.Router()

const router = require("express").Router();
const validatedRequest = require("../../middlewares/validator.middlewar");
const authCtrl = require("./auth.controller");
const { registerSchema, userActivationSchema, loginSchema, forgetPasswordSchema } = require("./auth.validater");
const uploader = require("../../middlewares/uploader.milddleware");
const checkLogin = require("../../middlewares/auth.middleware");
const checkPermission = require('../../middlewares/rbac.middleware');


router.post("/register",uploader.single('image'), validatedRequest(registerSchema), authCtrl.registerUser)
router.post("/activate/:token",validatedRequest(userActivationSchema), authCtrl.ActivateUser)

router.post("/login",validatedRequest(loginSchema), authCtrl.login) 
router.get("/me", checkLogin, authCtrl.getLoggedInUser)
//router.get("/refresh-token", checkLogin, authCtrl.refreshtoken)
router.get("/admin", checkLogin, checkPermission('admin'), (req, res, next) => {
    res.send("I am admin control")
})
router.post("/forget-password",validatedRequest(forgetPasswordSchema), authCtrl.forgetPassword )
router.post("/reset-password/:token", (req, res, next) => {

})
module.exports = router;
//authCtrl.getLoggedInUser