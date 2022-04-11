const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createOrderRate,
  deleteOrderRate,
  getCusOwnedRate,
  getServiceRate,
} = require("../controller/C_service_rating");

router.post("/create", auth, multipartMiddleware, createOrderRate);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteOrderRate
);

router.post("/customerrate", auth, multipartMiddleware, getCusOwnedRate);

router.post("/getservicerate", auth, multipartMiddleware, getServiceRate);

module.exports = router;
