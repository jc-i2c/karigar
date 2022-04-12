const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createPayment,
  getPayment,
} = require("../controller/C_payment_history");

router.post("/create", auth, multipartMiddleware, createPayment);

router.post("/getpayment", auth, multipartMiddleware, getPayment);

module.exports = router;
