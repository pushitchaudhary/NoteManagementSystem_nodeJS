const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    // supported image file type
    const supportedImageFormat = ['image/jpeg','image/jpg','image/png']
    // image type verfiy garn ko lagi
    const fileSize = file.size;
    console.log("file size is", fileSize)
    if(!supportedImageFormat.includes(file.mimetype)){
        cb(new Error("Image Type not supported"))
        return
    }

    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};