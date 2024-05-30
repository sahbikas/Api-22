const { generateRandomString } = require("../../helpers/helpers");

class AuthRequest{
    #data = {};
    constructor(req) {
        this.#data.body = req.body;
        this.#data.file = req.file;
    }
   tranformRegisterData() {
   // console.log("inside transformregisterdata");
    if(this.#data.file) {
        this.#data.body.image = this.#data.file.filename
    }

    this.#data.body.token = generateRandomString();
    this.#data.body.status = "inactive";
    return this.#data.body;
   }
   tranformUpdateData() {
    if(this.#data.file) {
        this.#data.body.image = this.#data.file.filename
    }
   
    return this.#data.body;
   }
}
module.exports = AuthRequest;