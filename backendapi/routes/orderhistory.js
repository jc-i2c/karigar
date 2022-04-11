const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createOrderhistory,
  getAllOrderhistory,
  getSingleOrderhistory,
  deleteOrderhistory,
  editOrderhistory,
  getOrderSerProvider,
  changeOrderStatus,
} = require("../controller/C_orderhistory");

router.post("/create", auth, multipartMiddleware, createOrderhistory);

router.post(
  "/all",
  auth,
  userrollauth,
  multipartMiddleware,
  getAllOrderhistory
);

router.post("/single", auth, multipartMiddleware, getSingleOrderhistory);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteOrderhistory
);

router.post("/edit", auth, userrollauth, multipartMiddleware, editOrderhistory);

router.post(
  "/getorderserprovider",
  auth,
  multipartMiddleware,
  getOrderSerProvider
);

router.post("/statuschange", auth, multipartMiddleware, changeOrderStatus);

module.exports = router;
