const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createCustSupSubTitle,
  getAllCusSupSubTitle,
  editCusSupSubTitle,
  deleteCusSupSubTitle,
} = require("../controller/C_custsupsubtitle");

router.post("/create", auth, userrollauth, multipartMiddleware, createCustSupSubTitle);

router.post("/getall", auth, multipartMiddleware, getAllCusSupSubTitle);

router.post("/edit", auth, userrollauth, multipartMiddleware, editCusSupSubTitle);

router.post("/delete", auth, userrollauth, multipartMiddleware, deleteCusSupSubTitle);

module.exports = router;
