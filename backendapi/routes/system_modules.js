const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createModules,
  getModules,
  updateModules,
  deleteModules,
} = require("../controller/C_system_modules");

router.post("/create", auth, multipartMiddleware, createModules);

router.post("/getall", auth, multipartMiddleware, getModules);

router.post("/update", auth, multipartMiddleware, updateModules);

router.post("/delete", auth, multipartMiddleware, deleteModules);

module.exports = router;
