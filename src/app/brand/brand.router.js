//const router = require("express").Router()

const checkLogin = require("../../middlewares/auth.middleware");
const  checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.milddleware");
const validatedRequest = require("../../middlewares/validator.middlewar");

// const checkPermission = require("../../middlewares/")
const router = require("express").Router()
const BrandController = require("./brand.controller");
const BrandService = require("./brand.service");
const ProductSvc = require("../product/product.service");
const  brandCtrl = new BrandController(BrandService, new ProductSvc)

const { BrandCreateSchema, BrandUpdateSchema } = require("./brand.validator");
//const ProductService = require("../product/product.service");

 router.get("/home-list", brandCtrl.getListForHome);
 router.get("/:slug/slug", brandCtrl.getBrandBySlug);

router.route("/")
    .get(checkLogin, checkPermission('admin'), brandCtrl.listAllBrands)
    .post(checkLogin, checkPermission('admin'), uploader.single('image'), validatedRequest(BrandCreateSchema), brandCtrl.storeBrand)

router.route("/:id")
    .get(checkLogin, checkPermission('admin'), brandCtrl.detailBrandById)
    .put(checkLogin, checkPermission('admin'),uploader.single('image'), validatedRequest(BrandUpdateSchema),  brandCtrl.updateBrand)
    .delete(checkLogin, checkPermission('admin'), brandCtrl.deleteBrandById)
module.exports = router;