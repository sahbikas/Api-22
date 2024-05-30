const fs = require('fs')
const generateRandomString = (len = 100) => {
    let chars = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let length = chars.length;
    let random = "";
    for(let i = 0; i < len; i++) {
        let posn = Math.floor(Math.random() * (length-1))
        random += chars[posn]
    }
    return random
}
    const deleteFile = (path) => {
        if(fs.existsSync(path)) {
            fs.unlinkSync(path)
            return true
        } else {
            return false;
        }
    }

module.exports = {
    generateRandomString,
    deleteFile
}