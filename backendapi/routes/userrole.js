const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  getAllRole,
  createRole,
  updateRole,
  delUserRole,
  getPermission,
} = require("../controller/C_userrole");

router.post("/create", auth, multipartMiddleware, createRole);
router.post("/edit", auth, multipartMiddleware, updateRole);
router.post("/getall", auth, multipartMiddleware, getAllRole);
router.post("/delete", auth, multipartMiddleware, delUserRole);
router.post("/getpermission", auth, multipartMiddleware, getPermission);

module.exports = router;
