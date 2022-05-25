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
  addServiceProviderDetails,
  getAllServiceProvider,
  changeStatus,
  getServiceList,
  getSubServiceList,
  getSerProOwnList,
  getProviderList,
  searchServiceProvider,
} = require("../controller/C_serviceprovider");

router.post("/create", auth, upload.single("image"), createProvider);

router.post("/all", auth, multipartMiddleware, getAllProvider);

router.post("/single", auth, multipartMiddleware, getSingleProvider);

router.post("/delete", auth, multipartMiddleware, deleteProvider);

router.post("/edit", auth, upload.single("image"), editProvider);

router.post(
  "/getallproviderlist",
  auth,
  multipartMiddleware,
  getAllProviderList
);

router.post(
  "/details",
  auth,
  userrollauth,
  multipartMiddleware,
  addServiceProviderDetails
);

router.post(
  "/getall",
  auth,
  userrollauth,
  multipartMiddleware,
  getAllServiceProvider
);

router.post("/changestatus", auth, multipartMiddleware, changeStatus);

router.post("/serviceslist", auth, multipartMiddleware, getServiceList);

router.post("/subserviceslist", auth, multipartMiddleware, getSubServiceList);

router.post("/ownlist", auth, multipartMiddleware, getSerProOwnList);

router.post("/getproviderlist", auth, multipartMiddleware, getProviderList);

router.post("/search", auth, multipartMiddleware, searchServiceProvider);

module.exports = router;
