const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,

    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true
    },
    mode: {
        type: String,
        enum: ['esewa', 'khalti', 'cod', 'bank'],
        default: 'cod'
    },
    payment: {
        type: Number,
        required: true,

    },
    status: {
        type: String,
        enum: ['paid', 'cancelled', 'pending'],
        default: "pending"
    }
},{
    autoCreate: true,
    autoIndex:true,
    timestamps: true
})

const TransactionModel = mongoose.model("Transaction", TransactionSchema)
module.exports = TransactionModel