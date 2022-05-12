const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const { createChatRoom, changeStatus } = require("../controller/C_chat_room");

router.post("/create", auth, multipartMiddleware, createChatRoom);

router.post("/changestatus", auth, multipartMiddleware, changeStatus);

module.exports = router;
