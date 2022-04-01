const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  createUpdatePrivacy,
  getPrivacyPolicy,
  deletePrivacyPolicy,
} = require("../controller/C_privacypolicy");

// Create or update privacy policy API.
router.post(
  "/addupdate",
  auth,
  userrollauth,
  multipartMiddleware,
  createUpdatePrivacy
);

router.post("/get", auth, multipartMiddleware, getPrivacyPolicy);

router.post(
  "/delete",
  auth,
  userrollauth,
  multipartMiddleware,
  deletePrivacyPolicy
);

module.exports = router;
