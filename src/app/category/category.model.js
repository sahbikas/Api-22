const mongoose = require("mongoose");


const { string } = require("zod");
// const banner = require(".");


const CategorySchema = new mongoose.Schema({
  title: {
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
       type: String,
       required: false
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: "inactive"
  },
  brands: [{
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      required: false
  }],
  image: {
    type: String,
    required: true
  },
  
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: false,
    default: null
  }
}, {
    timestamps: true,
    timeCreate: true,
    autoIndex: true
})

const CategoryModel = mongoose.model("Category", CategorySchema)
module.exports = CategoryModel;