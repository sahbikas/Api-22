const multer = require('multer')
const fs = require('fs');
const { date } = require("zod");
const mystorage = multer.diskStorage({
    destination: (req, file, cb) =>  {
        //console.log("destination")
        let path = "./public/uploads/"
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true});
        }
        //console.log("here")
        cb(null, path);
    },
    filename: (req, file, cb) => {

        let ext = (file.originalname.split(".")).pop()
        let name = Date.now()+"."+ext;
        //console.log("there")
        cb(null, name)
    }
})

const ImageFilter = (req, file, cb) => {
    let allowed = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    let ext = (file.originalname.split(".")).pop()
    if(allowed.includes(ext.toLowerCase())){
        //console.log("filter success")
        cb(null, true)
    } else {
        //console.log("Filter failed")
        cb({code: 400, msg: "file format not supported"}, null)
    }
}

const uploader = multer({
    storage: mystorage,
     fileFilter: ImageFilter,
    limits: {
         fileSize: 3000000
     }

})

module.exports = uploader;