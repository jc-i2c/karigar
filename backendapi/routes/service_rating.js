const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createServiceRate,
  deleteServiceRate,
  getCusOwnedRate,
  getServiceRate,
  countRate,
} = require("../controller/C_service_rating");

router.post("/create", auth, multipartMiddleware, createServiceRate);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteServiceRate
);

router.post("/customerrate", auth, multipartMiddleware, getCusOwnedRate);

router.post("/getservicerate", auth, multipartMiddleware, getServiceRate);

router.post("/countrate", auth, multipartMiddleware, countRate);

module.exports = router;
