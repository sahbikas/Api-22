require('dotenv').config();

const UserModel = require("./user.model");

class AuthService {

    async storUser(data) {
        try {
            let user = new UserModel(data);
            // UserModel.insertMany.create
            return await user.save();
        } catch (exception) {
            throw exception

        }
    }
    async getUserByFilter(filter = {}) {
        try {
            let userDetail = await UserModel.find(filter)

            return userDetail;
        } catch (exception) {
            throw exception;
        }
    }
    async updateUser(id, data) {
        try {
            let response = await UserModel.findOneAndUpdate(id, {
                $set: data
               
            })
            return response;
        } catch (exception) {
            throw exception;
        }
    }
    getResetMessage = (name, token) => {
        return `
        <b>Dear ${name}</b><br/>
        <p>if you have tried to reset your password, please click or copy paste the following link in the browser:,</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${token}"> ${process.env.FRONTEND_URL}/reset-password/${token}</p>
        <br/>
        <p>this token /url is vaild only for 3 hours</p>
        <p>if this was mistke, please ignore the message.</p>
        <p>Regards, </p>
        <P>NO reply, system</p>
        <p><small><em>Do not reply to this email</em></small></p>
        `
    }
}
const authSvc = new AuthService();
module.exports = authSvc