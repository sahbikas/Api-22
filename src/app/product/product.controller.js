const { deleteFile } = require("../../helpers/helpers")
const ProductService = require("./product.service")
//const bannerSvc = new BannerService()

class ProductController {
  
    constructor() {
         this.productSvc = new ProductService()
    }
    storeProduct =  async (req, res,next) =>{
     try{
         let data = this.productSvc.tranformProductCreateData(req)
         let createProduct =await this.productSvc.createProduct(data)
         res.json({
            result: createProduct,
            message: "Product created successfully",
            meta: null
         })
     }catch(exception){
        next(exception)
     }
    }
   listAllProducts = async(req, res, next) =>{
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
                {name: new RegExp(search, "i")},
                {description: new RegExp(search, "i")},
                {tags: new RegExp(search, "i")},
                {status: new RegExp(search, "i")},
                //{category: new RegExp(search, "i")}
            ]
        }
      }
      let count = await this.productSvc.totalCount(filter)
      let data = await this.productSvc.listAllProducts(filter, {skip: skip, limit: limit})

      res.json({
        result: data,
        message: "Product fetched successfully",
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
     detailProductById = async(req, res, next) => {
      try{
        let id = req.params.id
       // console.log(id)
          let productDetail = await this.productSvc.getProductById(id)
          res.json({
            result: productDetail,
            message: "Product Detail Fetched",
            meta: null
          })
      }catch(exception) {
        next(exception)
      }
    }

    getProductBySlug = async(req, res, next) => {
      try{
        let slug = req.params.slug
        //console.log(slug)
          let productDetail = await this.productSvc.getProductBySlug(slug)
          let catsId = productDetail.category.map((item) => item._id);
          let relatedProduct = await this.productSvc.listAllProducts({
            category: {$in: catsId},
            slug: {$ne: productDetail.slug},
          }, {skip: 0, limit:10})
          res.json({
            result: {productDetail, relatedProduct},
            message: "Product Detail Fetched",
            meta: null
          })
      }catch(exception) {
        next(exception)
      }
    }
    
     updateProduct = async(req, res, next) => {
      try{
        let productDetail = await this.productSvc.getProductById(req.params.id)
        if(!productDetail) {
          next({status: 404, message: "Brand does not exist"})
        }
        let data = this.productSvc.tranformProductCreateData(req, true)
        
          data.images = [...productDetail.images, ...data.images]

          let delImages = req.body.delImage;
          let updatedImages = [];
        if(delImages) {
          
          delImages = delImages.split(",");
          updatedImages = data.images.filter((image) => delImages.includes(image))
          data.images = updatedImages;
          delImages.map((item) => {
            deleteFile("./public/oploads/"+item)
          })
        }
        let oldProduct =await this.productSvc.updateProductById(data, productDetail._id)
        

        
        res.json({
           result: oldProduct,
           message: "Product update successfully",
           meta: null
        })
    }catch(exception){
       next(exception)
    }
    }
     deleteProductById = async(req, res,next) => {
         try{
          let oldData = await this.productSvc.deleteProductById(req.params.id)
          if(oldData) {
            oldData.images.map((item) => {
              deleteFile("./public/oploads/"+item)
            })
             res.json({
              result: oldData,
              message: "Product delete successfully",
              meta: null
             })
          } else {
            next({code: 404, message: "Product does not exists."})
          }
         } catch(exception) {
          next(exception)
         }
    }
    getListForHome = async(req, res, next) => {
    try{
      let search = req.query.search ?? null
     
      let limit = 10;
      let currentPage = (req.query.page) ? Number(req.query.page) : 1;
     
      let skip = (currentPage-1) * limit;
      let filter = {
        
      }

      
      if(search) {
        filter = {
            ...filter,
            $and:[ 
              {status: "active"},
           
            {$or: [
                {name: new RegExp(search, "i")},
                {description: new RegExp(search, "i")},
                {tags: new RegExp(search, "i")},
                {status: new RegExp(search, "i")},
                //{category: new RegExp(search, "i")}
            ]}
          ]
        }
      }
      let count = await this.productSvc.totalCount(filter)
      let data = await this.productSvc.listAllProducts(filter, {skip: skip, limit: limit})

      res.json({
        result: data,
        message: "Product fetched successfully",
        meta: {
            total: count,
            limit: limit,
            
          currentPage: currentPage
        }
      })
    }catch(exception) {
      //console.log(exception)
      next(exception);
    }
   }
   getTrendingProducts = async(req, res, next) => {
    try{
      let search = req.query.search ?? null
     
      let limit = 10;
      let currentPage = (req.query.page) ? Number(req.query.page) : 1;
     
      let skip = (currentPage-1) * limit;
      let filter = {}
  let date = new Date();

  date.setMonth(date.getMonth() -1);
      
      if(search) {
        filter = {
            ...filter,
            $and:[ 
              {status: "active"},
              {createdAt: {$gte: date}},
           
            {$or: [
                {name: new RegExp(search, "i")},
                {description: new RegExp(search, "i")},
                {tags: new RegExp(search, "i")},
                {status: new RegExp(search, "i")},
                //{category: new RegExp(search, "i")}
            ]}
          ]
        }
      }
      let count = await this.productSvc.totalCount(filter)
      let data = await this.productSvc.listAllProducts(filter, {skip: skip, limit: limit}, {viewCount: "DESC"})

      res.json({
        result: data,
        message: "Product fetched successfully",
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
   increaseViewCount = async(req, res, next) => {
    try{
      let productId = req.params.id;
      let productDetail = await this.productSvc.getProductById(productId)
      let update = await this.productSvc.updateProductById( {
        viewCount: productDetail.viewCount+1
      }, productId)
      res.json({
        result: update,
        message: "update view count",
        meta: null
      })
    }catch(exception) {
      next(exception)
    }
   }
}
//const bannerCtrl = new BannerController();
module.exports = ProductController;