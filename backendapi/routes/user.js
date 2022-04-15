const router = require("express").Router();
// const auth = require("../middleware/auth");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");

const {
  userSignUp,
  verifyOtp,
  userLogin,
  updateProfile,
  changePassword,
  resetPassword,
  isActive,
  profileDetails,
  getAllUsers,
  saveLocation,
  getUserLocation,
} = require("../controller/C_user");

// UserLoginSignUp user api
router.post("/signup", multipartMiddleware, userSignUp);

router.post("/verifyopt", multipartMiddleware, verifyOtp);

router.post("/login", multipartMiddleware, userLogin);

router.post("/updateprofile", auth, multipartMiddleware, updateProfile);

router.post("/changepassword", auth, multipartMiddleware, changePassword);

router.post("/resetpassword", multipartMiddleware, resetPassword);

router.post(
  "/activedeactive",
  auth,
  userrollauth,
  multipartMiddleware,
  isActive
);

router.post("/profiledetails", auth, multipartMiddleware, profileDetails);

router.post("/alluser", auth, userrollauth, multipartMiddleware, getAllUsers);

router.post("/savelocation", auth, multipartMiddleware, saveLocation);

router.post("/getuserlocation", auth, multipartMiddleware, getUserLocation);

module.exports = router;
