const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/uploadimage");

const {
  createHomeBanner,
  updateBanner,
  getAllBanner,
  deleteBanner,
} = require("../controller/C_banner");

router.post("/create", auth, upload.single("bannerimage"), createHomeBanner);

router.post("/getall", auth, multipartMiddleware, getAllBanner);

router.post("/delete", auth, multipartMiddleware, deleteBanner);

router.post("/update", auth, upload.single("bannerimage"), updateBanner);

module.exports = router;
