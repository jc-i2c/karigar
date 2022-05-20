const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createServiceHistory,
  getAllServiceHistory,
  getSingleServiceHistory,
  deleteServiceHistory,
  editServiceHistory,
  getServiceSerProvider,
  changeServiceStatus,
  customerBookService,
  getServiceStatus,
  getPaymentStatus,
  countJob,
  getSerProHistoty,
  Upcoming,
  History,
} = require("../controller/C_service_history");

router.post("/create", auth, multipartMiddleware, createServiceHistory);

router.post(
  "/all",
  auth,
  userrollauth,
  multipartMiddleware,
  getAllServiceHistory
);

router.post("/single", auth, multipartMiddleware, getSingleServiceHistory);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteServiceHistory
);

router.post(
  "/edit",
  auth,
  userrollauth,
  multipartMiddleware,
  editServiceHistory
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

router.post("/getserprohistoty", auth, multipartMiddleware, getSerProHistoty);

router.post("/upcoming", auth, multipartMiddleware, Upcoming);

router.post("/history", auth, multipartMiddleware, History);

module.exports = router;
