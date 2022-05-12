const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/uploadimage");
const userrollauth = require("../middleware/userrollauth");

const {
  createHomeBanner,
  updateBanner,
  getAllBanner,
  deleteBanner,
} = require("../controller/C_banner");

router.post(
  "/create",
  auth,
  userrollauth,
  upload.single("bannerimage"),
  createHomeBanner
);

router.post("/getall", auth, multipartMiddleware, getAllBanner);

router.post("/delete", auth, userrollauth, multipartMiddleware, deleteBanner);

router.post(
  "/update",
  auth,
  userrollauth,
  upload.single("bannerimage"),
  updateBanner
);

module.exports = router;
