const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  getAllRole,
  createRole,
  updateRole,
  delUserRole,
  getPermission,
} = require("../controller/C_userrole");

router.post("/create", auth, userrollauth, multipartMiddleware, createRole);

router.post("/edit", auth, userrollauth, multipartMiddleware, updateRole);

router.post("/getall", auth, userrollauth, multipartMiddleware, getAllRole);

router.post("/delete", auth, userrollauth, multipartMiddleware, delUserRole);

router.post("/getpermission", auth, multipartMiddleware, getPermission);

module.exports = router;
