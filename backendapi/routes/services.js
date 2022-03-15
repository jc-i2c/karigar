const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");
const { upload } = require("../middleware/uploadimage");

const {
  createServices,
  getAllServices,
  getSingleServices,
  deleteServices,
  editServices,
} = require("../controller/C_services");

router.post(
  "/create",
  auth,
  userrollauth,
  upload.single("serviceimage"),
  createServices
);

router.post("/all", auth, multipartMiddleware, getAllServices);

router.post("/single", auth, multipartMiddleware, getSingleServices);

router.post("/delete", auth, userrollauth, multipartMiddleware, deleteServices);

router.post(
  "/edit",
  auth,
  userrollauth,
  upload.single("serviceimage"),
  editServices
);

module.exports = router;
