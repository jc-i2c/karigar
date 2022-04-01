const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createCustSupTitle,
  getAllCusSupTitle,
  editCusSupTitle,
  deleteCusSupTitle,
} = require("../controller/C_custsuptitle");

router.post("/create", auth, userrollauth, multipartMiddleware, createCustSupTitle);

router.post("/getall", auth, multipartMiddleware, getAllCusSupTitle);

router.post("/edit", auth, userrollauth, multipartMiddleware, editCusSupTitle);

router.post("/delete", auth, userrollauth, multipartMiddleware, deleteCusSupTitle);

module.exports = router;
