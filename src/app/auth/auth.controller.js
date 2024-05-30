const dotenv = require("dotenv")
dotenv.config()

const AuthRequest = require("./auth.request");

const mailSvc = require("../../services/mail.services")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authSvc = require("./auth.service")
const { MongoClient } = require('mongodb');
const { generateRandomString } = require("../../helpers/helpers");
// core drive => mongodb packge
// ORM => mongoose packge
class Authcontroller {
    async registerUser(req, res, next) {
        //console.log("fist line register user");
        try {
            //console.log("inside register user ");
            let mapped = (new AuthRequest(req)).tranformRegisterData()

            const response = await authSvc.storUser(mapped
            )
            //single uploder, multiple => files
           mailSvc.sendEmail(
               mapped.email,
               "Activate your account",
               `<b>Dear ${mapped.name},</b>
      <p> your account has been registerd successfully.</p>
      <p> plese click the link below or copy the url to activate your account: </p>
      <a herf="${process.env.FRONTED_URL}/activate/${mapped.token}">
      ${process.env.FRONTED_URL}/activate/${mapped.token}
      </a>
      <p> thanku you agin for the use.</p>
      <p>regards, </P>
      <p> No repaly, system </p>
      <p><small><em>Do not repaly to this email</em></small></p> `,
             )
      

            res.json({
                result: response,
                //result: mapped,
                msg: "user Registerd",
                meta: null
            })
            console.log(mapped)
            // storag db
            //opt token 
        } catch (exception) {
            next(exception);
        }
    }
    async ActivateUser(req, res, next) {
        try {
            let token = req.params.token;
            const userDetail = await authSvc.getUserByFilter({ token: token })

            if (userDetail.length === 1) {
                let password = bcrypt.hashSync(req.body.password, 10);

                const updateResponse = await authSvc.updateUser(userDetail[0]._id, {
                    password: password,
                    token: null,
                    status: "active"
                })


                res.json({
                    result: updateResponse,
                    message: "your account has been update successfully.",
                    meta: null
                })
            } else {
                next({ code: 400, msg: "Token expired or does not exist" })
            }

        } catch (exception) {
            next(exception)
        }

    }
    async login(req, res, next) {
        try {
            // console.log("req", req);
            let credentials = req.body;
            let userDetail = await authSvc.getUserByFilter({

                email: credentials.email
            })
            
            if (userDetail.length !== 1) {
                next({ code: 400, message: "user dost not exists or not activated" })
            }
            userDetail = userDetail[0]
            if (userDetail.token) {
                next({ code: 400, message: "user not activated" })
            } else {
                if (userDetail.status !== 'active') {
                    next({ code: 401, message: "your account is suspended or not activated. conacte admin." })
                } else {
                    if (bcrypt.compareSync(credentials.password, userDetail.password)) {
                        let token = jwt.sign({
                            id: userDetail._id
                        }, process.env.JWT_SECRET, {
                            expiresIn: "1h"
                        })
                        let refreshToken = jwt.sign({
                            id: userDetail._id
                        }, process.env.JWT_SECRET, {
                            expiresIn: "7h"
                        })
                        res.json({
                            result: {
                                token: token,
                                refreshToken: refreshToken,
                                type: "bearer",
                                detail: {
                                    _id: userDetail._id,
                                    name: userDetail.name,
                                    email: userDetail.email,
                                    role: userDetail.role
                                }
                            },
                            message: "login success",
                            meta: null
                        })

                    } else {
                        next({
                            code: 400,
                            massage: "Credentials Dose not match"
                        })
                    }
                }

            }

        } catch (exception) {
            next(exception)

        }

    }
    getLoggedInUser = (req, res, next) => {
        res.json({
            result: req.authUser,
            message: "your profile",
            meta: null
        })
    }
    forgetPassword = async (req, res, next) => {
        try{
           let email = req.body.email
           let userDetail = await authSvc.getUserByFilter({
            email: email
           })
           if(userDetail.length === 1) {
              let user = userDetail[0]

              user.forgetToken = generateRandomString(100);
              let date = new Date();
              date.setUTCHours(date.getUTCHours()+3)
             // console.log(date)
              user.validateTill = date;
             await user.save()
            

              let message = authSvc.getResetMessage(user.name, user.forgetToken)

           await mailSvc.sendEmail(
            user.email,
            "Reset password",
            message
           ) 
        
           res.json({
            result:{
                user: user
            },
            message: "password reset token sent successfully",
            meta: null
           })
           } else {
            throw {code: 400, message: "user dose not exist"}
           }
        }catch(exception){
        next(exception)
        }
    }
    resetPassword = async(req, res, next) => {
        try {
            let token = req.params.token;
            const userDetail = await authSvc.getUserByFilter({
                 forgetToken: token,
                 validateTill: {$gte: (new Date())}
                
                })
                console.log(new Date, userDetail)
                //console.log(date, userDetail)

            if (userDetail.length === 1) {
                const password = bcrypt.hashSync(req.body.password, 10);

                const updateResponse = await authSvc.updateUser(userDetail[0]._id, {
                    password: password,
                    forgetToken: null,
                    validateTill: null
                })


                res.json({
                    result: updateResponse,
                    message: "your password has been changed successfully.",
                    meta: null
              })
               

                
            } else {
                next({ code: 400, msg: "Token expired or does not exist" })
            }

        } catch (exception) {
            next(exception)
        }

    }
}

const authCtrl = new Authcontroller()

module.exports = authCtrl;