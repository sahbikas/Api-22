// const banner = require("./");
const BannerModel = require("./banner.model");

class BannerService {
    tranformBannerCreateData(request, isEdit=false) {
        let banner = {
        ...request.body,
        createdBy: request.authUser._id
        }
        if(!request.file && isEdit === false) {
            throw {code: 400, message: "validation Failure", result: {image: "image is required"}}
        } else if(request.file) {
            banner['image'] = request.file.filename;

        }
        return banner;
    }
    createBanner = async (data) => {
        try{
      let banner = new BannerModel(data)
    return await  banner.save()
        }catch(exception) {
            throw exception
        }
    }

   totalCount = async(filter = {}) => {
   return BannerModel.countDocuments(filter)
   }
    listAllBanner = async(filter = {}, paging = {skip: 0, limit: 10}) => {
        try{
            console.log(filter)
            let banners = await BannerModel.find(filter)
                .populate("createdBy", ["_id", "name"])
                .sort({_id: "DESC"})
                .skip(paging.skip)
                .limit(paging.limit)
                return banners;
        }catch(exception) {
            throw exception;
        }
    }
    getBannerById = async(id) => {
        try{
            let banner = await BannerModel.findById(id)
            .populate("createdBy", ["_id", "name"])
            return banner;
        }catch(exception) {
            throw exception
        }
    }
    updateBannerById = async(data, id) => {
        try{
          let response = await BannerModel.findByIdAndUpdate(id, {
            $set: data
          })
          return response;
        }catch(exception) {
            throw exception;
        }
    }
    deleteBannerById = async(id) => {
        try{
            let response = await BannerModel.findByIdAndDelete(id);
            return response;

        } catch(exception) {
            throw exception;
        }
    }
    getBannerForHomer = async(limit) => {
try{
    let data = await BannerModel.find({
        status: "active"
    })
    .sort({"position": "ASC"})
    .limit(limit)
    return data;
}catch(exception) {
    throw exception
}
   
    }
}
module.exports =  BannerService;