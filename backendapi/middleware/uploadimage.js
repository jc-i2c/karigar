const path = require("path");
const multer = require("multer");
const fs = require("fs");
const logDir = "uploads";

const filePath = path.resolve(__dirname + "./../" + logDir);

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filePath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    var ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

var upload = multer({ storage: storage });

module.exports = { upload };
