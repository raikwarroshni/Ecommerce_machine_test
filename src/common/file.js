import multer from "multer";

// Upload image File using multer
var storageFile = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

// Upload image using multer
const imageUpload = multer({
  storage: storageFile,
  limits: {
    fileSize: "5000000",
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|wav|mp3|mp4|svg|pdf|csv)$/)) {
      return cb(
        new Error(
          "Please upload document in png,jpg,jpeg,wav,mp3,mp4,svg,pdf file format"
        )
      );
    }
    cb(undefined, true);
  },
});

export default { imageUpload };
