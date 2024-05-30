const express = require("express")
const app = express()

require("./mongodb.config");

const router = require("../routes")
const { ZodError, object } = require("zod")
const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken")
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/api/v1/', router)

app.use((req, res, next) => {
    next({ code: 404, message: "Not Found" })
})

app.use((error, req, res, next) => {
    //console.log(error);
    
    let code = error.code ?? 500;
    let msg = error.message ?? "Internal server error";

    if (error instanceof ZodError) {
        let errorMsg = {};
        error.errors.map((errorobj) => {
            // console.log(errorobj) 
            if(errorobj.path.length){
                errorMsg[errorobj.path[0]] = errorobj.message
            }else{
                errorMsg['cart']= "cart cannot empty"
            }
           
            
        })
        code = 400;
        msg = errorMsg;
    }

    if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        code = 401;
        msg = error.message;
    }
    let result = null
    if (error.code === 11000) {
        code = 422;
        const keys = object.keys(error.keyPattern);
        result = keys.map((key) => ({ [key]: key + "should be unique" }))
        msg = "validation Faild"
    }

    res.status(code).json({
        result: result,
        msg: msg,
        meta: null
    })
})

module.exports = app;