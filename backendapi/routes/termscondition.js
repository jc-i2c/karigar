const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createTermscondition,
  getAllTermscondition,
  editTermscondition,
  deleteTermscondition,
} = require("../controller/C_termsconditions");

router.post(
  "/create",
  auth,
  userrollauth,
  multipartMiddleware,
  createTermscondition
);

router.post("/getall", auth, multipartMiddleware, getAllTermscondition);

router.post(
  "/edit",
  auth,
  userrollauth,
  multipartMiddleware,
  editTermscondition
);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteTermscondition
);

module.exports = router;
