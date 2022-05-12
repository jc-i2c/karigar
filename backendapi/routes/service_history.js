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
  customerBookService,
  getServiceStatus,
  getPaymentStatus,
  countJob,
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

router.post(
  "/edit",
  auth,
  userrollauth,
  multipartMiddleware,
  editServicehistory
);

router.post(
  "/getorderserprovider",
  auth,
  multipartMiddleware,
  getServiceSerProvider
);

router.post("/statuschange", auth, multipartMiddleware, changeServiceStatus);

router.post(
  "/customerbookservice",
  auth,
  multipartMiddleware,
  customerBookService
);

router.post("/getservicestatus", auth, multipartMiddleware, getServiceStatus);

router.post("/getpaymentstatus", auth, multipartMiddleware, getPaymentStatus);

router.post("/countjob", auth, multipartMiddleware, countJob);

module.exports = router;
