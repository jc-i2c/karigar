const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createServicehistory,
  getAllServicehistory,
  getSingleServicehistory,
  deleteServicehistory,
  editServicehistory,
  getServiceSerProvider,
  changeServiceStatus,
} = require("../controller/C_service_history");

router.post("/create", auth, multipartMiddleware, createServicehistory);

router.post(
  "/all",
  auth,
  userrollauth,
  multipartMiddleware,
  getAllServicehistory
);

router.post("/single", auth, multipartMiddleware, getSingleServicehistory);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteServicehistory
);

router.post("/edit", auth, userrollauth, multipartMiddleware, editServicehistory);

router.post(
  "/getorderserprovider",
  auth,
  multipartMiddleware,
  getServiceSerProvider
);

router.post("/statuschange", auth, multipartMiddleware, changeServiceStatus);

module.exports = router;
