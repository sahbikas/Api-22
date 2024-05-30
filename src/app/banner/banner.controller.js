const { deleteFile } = require("../../helpers/helpers")
const BannerService = require("./banner.service")
//const bannerSvc = new BannerService()

class BannerController {
  
    constructor() {
         this.bannerSvc = new BannerService()
    }
    storeBanner =  async (req, res,next) =>{
     try{
         let data = this.bannerSvc.tranformBannerCreateData(req)
         let createBanner =await this.bannerSvc.createBanner(data)
         res.json({
            result: createBanner,
            message: "Banner created successfully",
            meta: null
         })
     }catch(exception){
        next(exception)
     }
    }
   listAllBanners = async(req, res, next) =>{
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
      let count = await this.bannerSvc.totalCount(filter)
      let data = await this.bannerSvc.listAllBanner(filter, {skip: skip, limit: limit})

      res.json({
        result: data,
        message: "banner fetched successfully",
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
     detailBannerById = async(req, res, next) => {
      try{
        let id = req.params.id
          let bannerDetail = await this.bannerSvc.getBannerById(id)
          res.json({
            result: bannerDetail,
            message: "Banner Detail Fetched",
            meta: null
          })
      }catch(exception) {
        next(exception)
      }
    }
    
     updateBanner = async(req, res,next) => {
      try{
        let bannerDetail = await this.bannerSvc.getBannerById(req.params.id)
        if(!bannerDetail) {
          next({status: 404, message: "Banner does not exist"})
        }
        let data = this.bannerSvc.tranformBannerCreateData(req, true)
        if(!data.image) {
          data.image = bannerDetail.image
        }
        
        let oldBanner =await this.bannerSvc.updateBannerById(data, bannerDetail._id)
        if(oldBanner.image !== data.image) {
          deleteFile('./public/uploads/'+oldBanner.image)
        }
        res.json({
           result: oldBanner,
           message: "Banner update successfully",
           meta: null
        })
    }catch(exception){
       next(exception)
    }
    }
     deleteBannerById = async(req, res,next) => {
         try{
          let oldData = await this.bannerSvc.deleteBannerById(req.params.id)
          if(oldData) {
            deleteFile("./public/oploads/"+oldData.image)
             res.json({
              result: oldData,
              message: "Banner delete successfully",
              meta: null
             })
          } else {
            next({code: 404, message: "Banner does not exists."})
          }
         } catch(exception) {
          next(exception)
         }
    }
    getListForHome = async(req, res, next) => {
    try{
      let limit = Number(req.params.limit) ?? 10
       let data = await this.bannerSvc.getBannerForHomer(limit)
       res.json({
        result: data,
        message: "Banner Fetched",
        meta: null
       })
    }catch(exception) {
      next(exception);
    }
   }
}
//const bannerCtrl = new BannerController();
module.exports = BannerController;