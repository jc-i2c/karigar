const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createFavSer,
  getCustomerFavSer,
} = require("../controller/C_favorite_service");

router.post("/create", auth, multipartMiddleware, createFavSer);

router.post("/cusfavsubser", auth, multipartMiddleware, getCustomerFavSer);

module.exports = router;
