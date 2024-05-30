//const router = require("express").Router()

const checkLogin = require("../../middlewares/auth.middleware");
const  checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.milddleware");
const validatedRequest = require("../../middlewares/validator.middlewar");

// const checkPermission = require("../../middlewares/")
const router = require("express").Router()
const CategoryController = require("./category.controller");
const CategoryService = require("./category.service");
const ProductService = require("../product/product.service")
const categoryCtrl = new CategoryController(CategoryService, new ProductService())

const { CategoryCreateSchema, CategoryUpdateSchema } = require("./category.validator");

 router.get("/home-list", categoryCtrl.getListForHome);

 router.get('/:slug/slug', categoryCtrl.getCategoryBySlug)

router.route("/")
    .get(checkLogin, checkPermission('admin'), categoryCtrl.listAllCategories)
    .post(checkLogin, checkPermission('admin'), uploader.single('image'), validatedRequest(CategoryCreateSchema), categoryCtrl.storeCategory)

router.route("/:id")
    .get(checkLogin, checkPermission('admin'), categoryCtrl.detailCategoryById)
    .put(checkLogin, checkPermission('admin'),uploader.single('image'), validatedRequest(CategoryUpdateSchema),  categoryCtrl.updateCategory)
    .delete(checkLogin, checkPermission('admin'), categoryCtrl.deleteCategoryById)
module.exports = router;