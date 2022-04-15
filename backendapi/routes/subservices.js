const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");
const { upload } = require("../middleware/uploadimage");

const {
  createSubServices,
  getAllSubServices,
  getSingleSubServices,
  deleteSubServices,
  editSubServices,
} = require("../controller/C_subservices");

router.post(
  "/create",
  auth,
  upload.single("subserviceimage"),
  createSubServices
);

router.post("/all", auth, userrollauth, multipartMiddleware, getAllSubServices);

router.post("/single", auth, multipartMiddleware, getSingleSubServices);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deleteSubServices
);

router.post(
  "/edit",
  auth,
  userrollauth,
  upload.single("subserviceimage"),
  editSubServices
);

module.exports = router;
