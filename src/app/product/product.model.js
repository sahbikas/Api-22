const mongoose = require("mongoose");


const { string } = require("zod");
// const banner = require(".");


const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 2
  },
  slug: {
    type: String,
    unique: true,
    required: true
    
  },
  description: {
       type: String
      
  },
  category: [{
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false
  }],
  brand: {
    type: mongoose.Types.ObjectId,
    ref: "Brand"

  }, 
  price: {
    type: Number,
    required: true,
    min: 1
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  afterDiscount: {
    type: Number,
    required: true,
    min: 1
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null
  },
  isFeatrued: {
    type: Boolean,
    default: false
  },
  tags: [{
      type: String
  }],
  stock: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: "inactive"
  },
  
  images: [{
    type: String,
    required: true
  }],
  
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: false,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "product",
    required: false
  }
}, {
    timestamps: true,
    timeCreate: true,
    autoIndex: true
})

const ProductModel = mongoose.model("Product", ProductSchema)
module.exports = ProductModel;