const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createUserRole,
  getAllRole,
  delUserRole,
  // updateUserRole,
  getPermission,
} = require("../controller/C_userrole");

router.post("/create", auth, multipartMiddleware, createUserRole);

router.post("/getall", auth, multipartMiddleware, getAllRole);

router.post("/delete", auth, multipartMiddleware, delUserRole);

// router.post("/update", auth, multipartMiddleware, updateUserRole);

router.post("/getpermission", auth, multipartMiddleware, getPermission);

module.exports = router;
