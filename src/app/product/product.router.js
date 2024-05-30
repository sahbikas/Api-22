//const router = require("express").Router()

const checkLogin = require("../../middlewares/auth.middleware");
const  checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.milddleware");
const validatedRequest = require("../../middlewares/validator.middlewar");

// const checkPermission = require("../../middlewares/")
const router = require("express").Router()
const ProductController = require("./product.controller");
const ProductService = require("./product.service");
const productCtrl = new ProductController(ProductService)

const { ProductCreateSchema, ProductUpdateSchema } = require("./product.validator");

 router.get("/home-list", productCtrl.getListForHome);
 router.get("/trending", productCtrl.getTrendingProducts);
 router.get('/:slug/slug', productCtrl.getProductBySlug)

 router.get("/", checkLogin, checkPermission('admin'), productCtrl.listAllProducts)

 router.route("/")
     .get(checkLogin, checkPermission('admin'), productCtrl.listAllProducts)
     .post(checkLogin, checkPermission('admin'), uploader.array('images'), validatedRequest(ProductCreateSchema), productCtrl.storeProduct)

     router.route("/:id")
     .get(checkLogin, checkPermission('admin'), productCtrl.detailProductById)

 router.route("/:id")
     .get(checkLogin, checkPermission('admin'), productCtrl.detailProductById)
     .put(checkLogin, checkPermission('admin'),uploader.array('images'), validatedRequest(ProductUpdateSchema),  productCtrl.updateProduct)
     .delete(checkLogin, checkPermission('admin'), productCtrl.deleteProductById)

//router.get('/:id/count', productCtrl.increaseViewCount)
module.exports = router;