const orderSvc = require("./order.service");
class OrderController {
   createOrder = async (req, res, next) => {
    try{
          const data = req.body;
          
          const cartDetail = await orderSvc.transformCartDetail(data);
          
          const createdDetail = await orderSvc.storeCartDetail(cartDetail);
          const orderDetail = await orderSvc.transformCartDetailToOrder(createdDetail, req.authUser);
          const orderData = await orderSvc.createOrder(orderDetail);
          
          res.json({
            
            result: orderData,
            msg: "Order Create successfully",
            meta: null
           
          })
    }catch(exception){
        next(exception)
       
    }
   
   }
   saveTransaction = async(req, res, next) => {
    try{
            let data = req.body;
            if(data.mode === "cod") {
              data.transactionId = null
            } else if(data.mode !== "cod" && !data.transactionId) {
               throw {code: 400, msg: "Transaction Id is requrired"}
            }
            
            let format = {
              ...data,
              orderId: req.params.orderId
            }
            const transactionSts = await orderSvc.saveTransaction(format)
            res.json({
              result: transactionSts,
              msg: "Your payment updated",
              meta: null
            })
    }catch(exception){
      next(exception)
    }
   }
}

const orderCtrl = new OrderController()

module.exports = orderCtrl;