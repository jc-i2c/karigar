const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createChatRoom,
  changeStatus,
  getRoom,
} = require("../controller/C_chat_room");

router.post("/create", auth, multipartMiddleware, createChatRoom);

router.post("/changestatus", auth, multipartMiddleware, changeStatus);

router.post("/getroom", auth, multipartMiddleware, getRoom);

module.exports = router;
