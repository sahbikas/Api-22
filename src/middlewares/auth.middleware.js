const dotenv = require("dotenv")
dotenv.config()
//const jwt = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
const authSvc = require("../app/auth/auth.service");

const checkLogin = async (req, res, next) => {
    try {
        let token = null;

        if (req?.query['token']) {
            token = req?.query['token']
        }
        if (req.headers['authorization']) {
            token = req.headers['authorization']
        }
        if (!token) {
            next({ code: 401, message: "Token not set" })
        } else {
            token = (token.split(" ")).pop()

            if (!token) {
                next({ code: 401, message: "Token is empty or not set" })
            } else {
                const data = jwt.verify(token, process.env.JWT_SECRET)
                
                if (!data.hasOwnProperty('id')) {
                    next({ code: 401, message: "invalid token" })
                } else {
                    let userDetail = await authSvc.getUserByFilter({
                        _id: data.id
                    })
                    if(userDetail.length !== 1){
                       next({code: 401, message: "user dose not exists anymore"})
                    }
                    //console.log(data)
                    //todd: db verify
                    req.authUser = userDetail[0]   // todd update user here
                    next()
                }
            }

        }
    } catch (exception) {
        console.log({ exception })
        next(exception)
    }

}
module.exports = checkLogin;