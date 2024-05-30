// const banner = require("./");
const ProductModel = require("./product.model");
const slugify = require("slugify");

class ProductService {
    tranformProductCreateData(request, isEdit = false) {
        let product = {
            ...request.body,
            createdBy: request.authUser._id
        }
        if (product.category) {
            product.category = product.category.split(",")
        } else if (!product.category || product.category === 'null') {
            product.brand = null
        }


        if (!product.brand || product.brand === 'null') {
            product.brand = null
        } else {
            product.brand = product.brand.split(",")
        }

        if (!product.seller || product.seller === 'null') {
            product.seller = null
        }
        if (!request.files && isEdit === false) {
            throw { code: 400, message: "validation Failure", result: { images: "image is required" } }
        } else if (request.files) {
            product['images'] = request.files.map((image) => image.filename);

        }

        if (!isEdit) {
            product['slug'] = slugify(product.name, {
                replacement: "-",
                lower: true,
                trim: true
            })
        }

        if (isEdit) {
            delete product.delImages;
        }

        product['afterDiscount'] = product.price - product.price * product.discount / 100;

        return product;
    }

  increaseCount = async (productId) => {
    try{
        let productId = req.params.id;
      let productDetail = await this.getProductById(productId)
      let update = await this.updateProductById( {
        viewCount: productDetail.viewCount+1
      }, productId)
      return update;
    }catch(exception){
        throw exception;
    }
  }

    createProduct = async (data) => {
        try {
            let product = new ProductModel(data)
            return await product.save()
        } catch (exception) {
            throw exception
        }
    }

    totalCount = async (filter = {}) => {
        return ProductModel.countDocuments(filter)
    }

    listAllProducts = async (filter = {}, paging = { skip: 0, limit: 10 }, sort = { _id: "DESC" } ) => {
        try {
            console.log(filter)
            let products = await ProductModel.find(filter)
                .populate('category', ["_id", 'title', 'parent', 'image', 'slug'])
                .populate('brand', ["_id", 'title', 'image', 'slug'])
                .populate("seller", ["_id", "name",])
                .populate("createdBy", ["_id", "name",])
                .sort(sort)
                .skip(paging.skip)
                .limit(paging.limit)
            return products;
        } catch (exception) {
            throw exception;
        }
    }
    getProductById = async (id) => {
        try {
            let product = await ProductModel.findById(id)
                .populate('category', ["_id", 'title', 'parent', 'image', 'slug'])
                .populate('brand', ["_id", 'title', 'image', 'slug'])
                .populate("seller", ["_id", "name",])
                .populate("createdBy", ["_id", "name",])
            return product;
        } catch (exception) {
            throw exception
        }
    }

    getProductBySlug = async (slug) => {
        try {
            let product = await ProductModel.findOne({
                slug: slug
            })
                .populate('parent', ["_id", 'title', 'parent', 'image', 'slug'])
                .populate('brand', ["_id", 'title', 'image', 'slug'])
                .populate("createdBy", ["_id", "name"])
            return product;
        } catch (exception) {
            throw exception
        }
    }
    updateProductById = async (data, id) => {
        try {
            let response = await ProductModel.findByIdAndUpdate(id, {
                $set: data
            })
            return response;
        } catch (exception) {
            throw exception;
        }
    }
    deleteProductById = async (id) => {
        try {
            let response = await ProductModel.findByIdAndDelete(id);
            return response;

        } catch (exception) {
            throw exception;
        }
    }
    getProductForHomer = async (limit) => {
        try {
            let data = await ProductModel.find({
                status: "active"
            })
                .populate('parent', ["_id", 'title', 'parent', 'image', 'slug'])
                .populate('brand', ["_id", 'title', 'image', 'slug'])
                .populate("createdBy", ["_id", "name"])
                .sort({ "position": "ASC" })
                .limit(limit)
            return data;
        } catch (exception) {
            throw exception
        }
    }

}

module.exports = ProductService;