// const banner = require("./");
const CategoryModel = require("./category.model");
const slugify =require("slugify");
class CategoryService {
    tranformCategoryCreateData(request, isEdit=false) {
        let category = {
        ...request.body,
        createdBy: request.authUser._id
        }
        if(category.brands){
            category.brands = category.brands.split(",")
        } else if(!category.brands || category.brands === 'null') {
            category.brands = null
        }

        
        if(!category.parent || category.parent === 'null') {
            category.parent = null
        }
        if(!request.file && isEdit === false) {
            throw {code: 400, message: "validation Failure", result: {image: "image is required"}}
        } else if(request.file) {
            category['image'] = request.file.filename;

        }

        if(!isEdit) {
            category['slug'] = slugify(category.title, {
                replacement: "-",
                lower: true,
                trim: true
            })
        }
        return category;
    }
    createCategory = async (data) => {
        try{
      let category = new CategoryModel(data)
    return await  category.save()
        }catch(exception) {
            throw exception
        }
    }

   totalCount = async(filter = {}) => {
   return CategoryModel.countDocuments(filter)
   }
    listAllCategory = async(filter = {}, paging = {skip: 0, limit: 10}) => {
        try{
            console.log(filter)
            let categories = await CategoryModel.find(filter)
                .populate('parent', ["_id", 'title', 'parent', 'image', 'slug'])
                .populate('brands', ["_id", 'title', 'image', 'slug'])
                .populate("createdBy", ["_id", "name", ])
                .sort({_id: "DESC"})
                .skip(paging.skip)
                .limit(paging.limit)
                return categories;
        }catch(exception) {
            throw exception;
        }
    }
    getCategoryById = async(id) => {
        try{
            let category = await CategoryModel.findById(id)
            .populate('parent', ["_id", 'title', 'parent', 'image', 'slug'])
            .populate('brands', ["_id", 'title', 'image', 'slug'])
            .populate("createdBy", ["_id", "name"])
            return category;
        }catch(exception) {
            throw exception
        }
    }

    getCategoryBySlug = async(slug) => {
        try{
            let category = await CategoryModel.findOne({
                
                slug: slug
               
            })
            .populate('parent', ["_id", 'title', 'parent', 'image', 'slug'])
            .populate('brands', ["_id", 'title', 'image', 'slug'])
            .populate("createdBy", ["_id", "name"])
            return category;
        }catch(exception) {
            //console.log(exception)
            throw exception
        }
    }
    updateCategoryById = async(data, id) => {
        try{
          let response = await CategoryModel.findByIdAndUpdate(id, {
            $set: data
          })
          return response;
        }catch(exception) {
            throw exception;
        }
    }
    deleteCategoryById = async(id) => {
        try{
            let response = await CategoryModel.findByIdAndDelete(id);
            return response;

        } catch(exception) {
            throw exception;
        }
    }
    getCategoryForHomer = async(limit) => {
        try{
            let data = await CategoryModel.find({
                status: "active"
            })
            .populate('parent', ["_id", 'title', 'parent', 'image', 'slug'])
            .populate('brands', ["_id", 'title', 'image', 'slug'])
            .sort({"position": "ASC"})
            .limit(limit)
            return data;
        }catch(exception) {
            throw exception
        }
    }   
    
}
module.exports = new CategoryService();