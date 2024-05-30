const userSvc = require('./user.service')
//const { model } = require("mongoose")
const AuthRequest = require("../auth/auth.request");
const authSvc = require('../auth/auth.service');
class UserController {
listUsers = async(req, res, next) => {
    try{
  let page = req.query['page'] || 1;
  let limit = req.query['limit'] || 10
  let skip = (page - 1) * limit;

  let filterOpts = [];
  if(req.query['role']) {
    filterOpts.push({
        role: req.query['role']

    })
  }

  if(req.query['search']) {
    filterOpts.push({
      $or:  [
         {name: new RegExp(req.query['search'], 'i')},   
         {email: new RegExp(req.query['search'], 'i')},  
        ]
    })
  }
  let filter = {}
  filterOpts.push({
    _id: {$ne: req.authUser._id}
  })
  if(filterOpts.length) {
    filter = {
      $and: filterOpts
    }
  }
  
  let count = await userSvc.getCount(filter);
  let listUsers = await userSvc.getListOfUsers(filter,skip, limit)
  res.json({
    result: listUsers,
    message: "User Lists",
    meta: {
      limit: limit,
      total: count,
      currentPage: page
    }
  })
    }catch(exception) {
        next(exception)
    }
}

updateUser = async(req, res, next) => {
  try{
   let id =req.params.id;
   let user = await userSvc.getUserById(id);
   
    //console.log("inside register user ");
    let mapped = (new AuthRequest(req)). tranformUpdateData()

    const response = await userSvc.updateuser(mapped, id)
  
    res.json({
        result: response,
        //result: mapped,
        msg: "user Update",
        meta: null
    })
   
  }catch(exception) {
  next(exception)
  }
}
getUserById = async(req, res, next) => {
  try{
   let id = req.params.id;
   let userDetail = await userSvc.getUserById(id);
   res.json({
    result: userDetail,
    msg: "User Detail",
    meta: null
   })
  }catch(exception){
    next(exception);
  }
}
deleteById = async(req, res, next) => {
  try{
   let delStatus = await userSvc.deleteUserById(req.params.id);
   res.json({
    result: delStatus,
    msg: "User Deleted successfully",
    mete: null
   })
  }catch(exception){
    next(exception)
  }
}

}

const userCtrl = new UserController()

module.exports = userCtrl;