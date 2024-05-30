const mongoose = require("mongoose")
const CartDetailSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true
    },
    qty: {
        type: Number,
        min: 1,
        required: true
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    totalAmt: {
        type: Number,
        min: 1,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'verfied', 'cancelled', 'delivered'],
        default: "new"
    }
},{
    autoCreate: true,
    autoIndex: true,
    timestamps: true
})

const CartDetailModel = mongoose.model("CartDetail", CartDetailSchema)
module.exports = CartDetailModel;