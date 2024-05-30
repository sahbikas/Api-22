const ProductModel = require("../product/product.model");
const CartDetailModel = require("./cart-detail.model");
const OrderModel = require("./order.model");
const TransactionModel = require("./transation.model")
class OrderService {
    transformCartDetail = async(cart) =>{
         try{
             let formattedCart = [];
             if(cart.length === 0) {
                throw {code: 400, message: "Cart cannot be empty"}
             }
              let productIds = cart.map((item) => item.productId);

            const products = await ProductModel.find({
                _id: {$in: productIds}
            })
            
            products.map((item) => {
                let currentItem = (cart.filter((cartElem) => item._id.equals(cartElem.productId)))[0];
                console.log(currentItem)
                let singleItem = {
                    productId: item._id,
                    qty: currentItem.qty,
                    price: item.afterDiscount,
                    totalAmt: currentItem.qty * item.afterDiscount,
                    status: "new"
                }
                formattedCart.push(singleItem)
                console.log(singleItem)
             })
             return formattedCart
         }catch(exception) {
            throw exception
         }
         
    }
    storeCartDetail = async (detail) => {
        
        try{
            console.log(detail)
          let response= await CartDetailModel.insertMany(detail)
          console.log(response)
          return response;
        }catch(exception){

            throw exception
        }
    }
    transformCartDetailToOrder = async(cartDetailObjs, buyer) =>{
        try{
           let ids =[];
           let subTotal = 0;
           let discount = 0;
           let taxAmt = 0;
                cartDetailObjs.map((detail) => {
                   ids.push(detail._id)
                   subTotal += Number(detail.totalAmt)
                })
                taxAmt = (subTotal - discount) * 13/100;
                  let orderData = {
                    buyerId: buyer._id,
                    cartDetail: ids,
                    subTotal: subTotal,
                    discount: discount,
                    taxAmt: taxAmt,
                    totalAmt: subTotal - discount + taxAmt,
                    isPaid: false,
                    status: "new"
                  }
                  return orderData;
        }catch(exception){
            throw exception;
        }
    }
    createOrder = async(detail) =>{
        try{
           let orderObje = new OrderModel(detail)
           return await orderObje.save();
        }catch(exception){
            throw exception
        }
    }
    saveTransaction = async (data) =>{
        try{
            let transaction = new TransactionModel(data)
            let transactionSts = await transaction.save()
              await OrderModel.findByIdAndUpdate(data.orderId,{
                status: "verfiy",
                isPaid: true
             })
             return transactionSts
        }catch(exception) {
            throw exception
        }
    }
    
}

const orderSvc = new OrderService()

module.exports = orderSvc;