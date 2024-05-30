const mongoose = require("mongoose")
// const banner = require(".");


const BrandSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: "inactive"
  },
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

const BrandModel = mongoose.model("Brand", BrandSchema)
module.exports = BrandModel;