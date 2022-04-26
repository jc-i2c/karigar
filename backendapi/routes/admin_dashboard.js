const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const { getWidgetData } = require("../controller/C_admin_dashboard");

router.post(
  "/widgetdata",
  auth,
  userrollauth,
  multipartMiddleware,
  getWidgetData
);

module.exports = router;
