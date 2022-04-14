const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createChat,
  changeStatus,
  getAllMessage,
} = require("../controller/C_chat");

router.post("/create", auth, multipartMiddleware, createChat);

router.post("/changestatus", auth, multipartMiddleware, changeStatus);

router.post("/getallmessage", auth, multipartMiddleware, getAllMessage);

module.exports = router;
