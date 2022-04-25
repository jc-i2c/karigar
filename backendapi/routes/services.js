const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");
const { upload } = require("../middleware/uploadimage");

const {
  createServices,
  getAllServices,
  getSingleServices,
  deleteServices,
  editServices,
  topFiveServices,
} = require("../controller/C_services");

router.post("/create", auth, upload.single("serviceimage"), createServices);

router.post("/all", auth, multipartMiddleware, getAllServices);

router.post("/single", auth, multipartMiddleware, getSingleServices);

router.post("/delete", auth, multipartMiddleware, deleteServices);

router.post("/edit", auth, upload.single("serviceimage"), editServices);

router.post("/topfiveservices", auth, multipartMiddleware, topFiveServices);

module.exports = router;
