const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createChatReq,
  changeStatus,
  getAllChatRequest,
  getAllCusChatRequest,
} = require("../controller/C_chat_request");

router.post("/create", auth, multipartMiddleware, createChatReq);

router.post("/changestatus", auth, multipartMiddleware, changeStatus);

router.post("/getallchatrequest", auth, multipartMiddleware, getAllChatRequest);

router.post(
  "/getallcuschatrequest",
  auth,
  multipartMiddleware,
  getAllCusChatRequest
);

module.exports = router;
