const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");
const { upload } = require("../middleware/uploadimage");

const {
  createProvider,
  getAllProvider,
  getSingleProvider,
  deleteProvider,
  editProvider,
  getAllProviderList,
} = require("../controller/C_serviceprovider");

router.post(
  "/create",
  auth,
  userrollauth,
  upload.single("image"),
  createProvider
);

router.post("/all", auth, multipartMiddleware, getAllProvider);

router.post("/single", auth, multipartMiddleware, getSingleProvider);

router.post("/delete", auth, userrollauth, multipartMiddleware, deleteProvider);

router.post("/edit", auth, userrollauth, upload.single("image"), editProvider);

router.post(
  "/getallproviderlist",
  auth,
  multipartMiddleware,
  getAllProviderList
);

module.exports = router;
