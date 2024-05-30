

const router = require("express").Router()
const checkLogin = require("../../middlewares/auth.middleware");
const checkPermission = require("../../middlewares/rbac.middleware");
//const { validate } = require("../auth/user.model");
const userCtrl = require('./user.controller');
const {registerAdminTooSchema, updateUserSchema} =require('../auth/auth.validater');
const authCtrl = require("../auth/auth.controller");
const uploader = require('../../middlewares/uploader.milddleware');
const validatedRequest = require('../../middlewares/validator.middlewar');
const userService = require("./user.service");
router.route('/')
    .get(checkLogin, checkPermission('admin'), userCtrl.listUsers)
    .post( checkLogin,  checkPermission('admin'),  uploader.single('image'),  validatedRequest(registerAdminTooSchema),  authCtrl.registerUser)
    
    router.route('/:id')
    .put(checkLogin,  checkPermission('admin'),  uploader.single('image'),  validatedRequest(updateUserSchema),  userCtrl.updateUser)
    .get(checkLogin, checkPermission('admin'), userCtrl.getUserById)
    .delete(checkLogin, checkPermission('admin'), userCtrl.deleteById)
module.exports =  router;