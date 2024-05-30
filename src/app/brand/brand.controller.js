const { deleteFile } = require("../../helpers/helpers")
const  BrandService = require("./brand.service")
//const bannerSvc = new BannerService()

class BrandController {
  brandSvc;
  prodSvc;
    constructor(BrandService, prodSvc){
         this.brandSvc = new  BrandService
         this.prodSvc = prodSvc;
    }
    storeBrand =  async (req, res,next) =>{
     try{
         let data = this.brandSvc.tranformBrandCreateData(req)
         let createBrand =await this.brandSvc.createBrand(data)
         res.json({
            result: createBrand,
            message: "Brand created successfully",
            meta: null
         })
     }catch(exception){
        next(exception)
     }
    }

getBrandBySlug = async(req, res, next) => {
  try{
    
   let slug = req.params.slug;
    let limit = 10;
    let currentPage = (req.query.page) ? Number(req.query.page) : 1;
   
    let skip = (currentPage-1) * limit;
    

    
    
    let count = await this.brandSvc.totalCount({})
    let data = await this.brandSvc.getBrandBySlug(slug)

    let products = await this.prodSvc.listAllProducts({
      brand: data._id
    }, skip, limit)

    res.json({
      result: {detail: data, products},
      message: "brand fetched successfully",
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

listAllBrands = async(req, res, next) =>{
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
      let count = await this.brandSvc.totalCount(filter)
      let data = await this.brandSvc.listAllBrands(filter, {skip: skip, limit: limit})

      res.json({
        result: data,
        message: "brand fetched successfully",
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
     detailBrandById = async(req, res, next) => {
      try{
        let id = req.params.id
          let brandDetail = await this.brandSvc.getBrandById(id)
          res.json({
            result: brandDetail,
            message: "Brand Detail Fetched",
            meta: null
          })
      }catch(exception) {
        next(exception)
      }
    }
    
     updateBrand = async(req, res,next) => {
      try{
        let brandDetail = await this.brandSvc.getBrandById(req.params.id)
        if(!brandDetail) {
          next({status: 404, message: "Brand does not exist"})
        }
        let data = this.brandSvc.tranformBrandCreateData(req, true)
        if(!data.image) {
          data.image = brandDetail.image
        }
        
        let oldBrand =await this.brandSvc.updateBrandById(data, brandDetail._id)
        if(oldBrand.image !== data.image) {
          deleteFile('./public/uploads/'+oldBrand.image)
        }
        res.json({
           result: oldBrand,
           message: "Brand update successfully",
           meta: null
        })
    }catch(exception){
       next(exception)
    }
    }
     deleteBrandById = async(req, res,next) => {
         try{
          let oldData = await this.brandSvc.deleteBrandById(req.params.id)
          if(oldData) {
            deleteFile("./public/oploads/"+oldData.image)
             res.json({
              result: oldData,
              message: "Brand delete successfully",
              meta: null
             })
          } else {
            next({code: 404, message: "Brand does not exists."})
          }
         } catch(exception) {
          next(exception)
         }
    }
    getListForHome = async(req, res, next) => {
    try{
      let limit = Number(req.params.limit) ?? 10
       let data = await this.brandSvc.getBrandForHomer(limit)
       res.json({
        result: data,
        message: "Brand Fetched",
        meta: null
       })
    }catch(exception) {
      next(exception);
    }
   }
}
//const bannerCtrl = new BannerController();
module.exports =  BrandController;