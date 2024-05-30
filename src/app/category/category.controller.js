const { deleteFile } = require("../../helpers/helpers")
const CategoryService = require("./category.service")
// const productSvc =require("./../product/product.service")
//const bannerSvc = new BannerService()

class CategoryController {
  categorySvc;
  productSvc;
    constructor(svc, prodSvc) {
         this.categorySvc = svc
         this.productSvc = prodSvc
    }
    storeCategory =  async (req, res,next) =>{
     try{
         let data = this.categorySvc.tranformCategoryCreateData(req)
         let createCategory =await this.categorySvc.createCategory(data)
         res.json({
            result: createCategory,
            message: "Category created successfully",
            meta: null
         })
     }catch(exception){
        next(exception)
     }
    }
   listAllCategories = async(req, res, next) =>{
    try{
      let search = req.query.search ?? null
     
      let limit = 10;
      let currentPage = (req.query.page) ? Number(req.query.page) : 1;
     
      let skip = (currentPage-1) * limit;
      let filter = {}

      
      if(search) {
        filter = {
            ...filter,
            $or: [
                {title: new RegExp(search, "i")},
                {link: new RegExp(search, "i")},
                {status: new RegExp(search, "i")}
            ]
        }
      }
      let count = await this.categorySvc.totalCount(filter)
      let data = await this.categorySvc.listAllCategory(filter, {skip: skip, limit: limit})

      res.json({
        result: data,
        message: "Category fetched successfully",
        meta: {
            total: count,
            limit: limit,
            currentPage: currentPage
        }
      })

    }catch(exception) {
        next(exception)
    }
    }
     detailCategoryById = async(req, res, next) => {
      try{
        let id = req.params.id
       // console.log(_id)
          let categoryDetail = await this.categorySvc.getCategoryById(id)
          res.json({
            result: categoryDetail,
            message: "Category Detail Fetched",
            meta: null
          })
      }catch(exception) {
        next(exception)
      }
    }

    getCategoryBySlug = async(req, res, next) => {
      try{
        let slug = req.params.slug
        //console.log(slug)
          let categoryDetail = await this.categorySvc.getCategoryBySlug(slug)
          if(!categoryDetail){
            throw {code: 404, message: "Category does not exists"}
          }

          let products = await this.productSvc.listAllProducts({
            
            category: categoryDetail._id
           
          }) 
          res.json({
            result: {categoryDetail, products},
            message: "Category Detail Fetched",
            meta: null
          })
      }catch(exception) {
        //console.log(exception)
        next(exception)
       // console.log(exception)
      }
    }
    
     updateCategory = async(req, res,next) => {
      try{
        let categoryDetail = await this.categorySvc.getCategoryById(req.params.id)
        if(!categoryDetail) {
          next({status: 404, message: "Brand does not exist"})
        }
        let data = this.categorySvc.tranformCategoryCreateData(req, true)
        if(!data.image) {
          data.image = categoryDetail.image
        }
        
        let oldCategory =await this.categorySvc.updateCategoryById(data, categoryDetail._id)
        if(oldCategory.image !== data.image) {
          deleteFile('./public/uploads/'+oldCategory.image)
        }
        res.json({
           result: oldCategory,
           message: "Category update successfully",
           meta: null
        })
    }catch(exception){
       next(exception)
    }
    }
     deleteCategoryById = async(req, res,next) => {
         try{
          let oldData = await this.categorySvc.deleteCategoryById(req.params.id)
          if(oldData) {
            deleteFile("./public/oploads/"+oldData.image)
             res.json({
              result: oldData,
              message: "Category delete successfully",
              meta: null
             })
          } else {
            next({code: 404, message: "Category does not exists."})
          }
         } catch(exception) {
          next(exception)
         }
    }
    getListForHome = async(req, res, next) => {
    try{
      let limit = Number(req.params.limit) ?? 10
       let data = await this.categorySvc.getCategoryForHomer(limit)
       res.json({
        result: data,
        message: "Category Fetched",
        meta: null
       })
    }catch(exception) {
      next(exception);
    }
   }
}
//const bannerCtrl = new BannerController();
module.exports =  CategoryController;