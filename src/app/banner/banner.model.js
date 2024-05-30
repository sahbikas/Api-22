const mongoose = require("mongoose")
// const banner = require(".");


const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3
  },
  link: {
    type: String,
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
  position:{
    type: Number,
    default: 0
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

const BannerModel = mongoose.model("banner", BannerSchema)
module.exports = BannerModel;