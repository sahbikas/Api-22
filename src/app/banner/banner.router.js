//const router = require("express").Router()

const checkLogin = require("../../middlewares/auth.middleware");
const  checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.milddleware");
const validatedRequest = require("../../middlewares/validator.middlewar");

// const checkPermission = require("../../middlewares/")
const router = require("express").Router()
const BannerController = require("./banner.controller");
const BannerService = require("./banner.service");
const bannerCtrl = new BannerController(BannerService)

const { BannerCreateSchema, BannerUpdateSchema } = require("./banner.validator");

 router.get("/home-list", bannerCtrl.getListForHome);

router.route("/")
    .get(checkLogin, checkPermission('admin'), bannerCtrl.listAllBanners)
    .post(checkLogin, checkPermission('admin'), uploader.single('image'), validatedRequest(BannerCreateSchema), bannerCtrl.storeBanner)

router.route("/:id")
    .get(checkLogin, checkPermission('admin'), bannerCtrl.detailBannerById)
    .put(checkLogin, checkPermission('admin'),uploader.single('image'), validatedRequest(BannerUpdateSchema),  bannerCtrl.updateBanner)
    .delete(checkLogin, checkPermission('admin'), bannerCtrl.deleteBannerById)
module.exports = router;