const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const { craeteIntent, confirmPayment } = require("../controller/C_payment");

router.post("/paymentintent", auth, multipartMiddleware, craeteIntent);

router.post("/confirmpayment", auth, multipartMiddleware, confirmPayment);

module.exports = router;
