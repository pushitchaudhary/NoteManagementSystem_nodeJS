const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // supported image file type
      const supportedImageFormat = ['image/jpeg','image/jpg','image/png']
      // image type verfiy garn ko lagi
      const fileSize = file.size;
      if(!supportedImageFormat.includes(file.mimetype)){
          cb(new Error("Image Type not supported"))
          return
      }
    cb(null, "./uploads/");
    } catch (error) {
      cb(res.send('Error'))
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};