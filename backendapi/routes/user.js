const router = require("express").Router();
// const auth = require("../middleware/auth");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");
const userrollauth = require("../middleware/userrollauth");
const { upload } = require("../middleware/uploadimage");

const {
  userSignUp,
  verifyOtp,
  userLogin,
  updateProfile,
  changePassword,
  resetPassword,
  activeDeactive,
  customerProfile,
  getAllUsers,
  saveLocation,
  getUserLocation,
  deleteUser,
  createNewPassword,
  getAllCustomer,
  getAllServiceProvider,
  adminEditUserData,
  verifyUser,
} = require("../controller/C_user");

// UserLoginSignUp user api
router.post("/signup", multipartMiddleware, userSignUp);

router.post("/verifyopt", multipartMiddleware, verifyOtp);

router.post("/signin", multipartMiddleware, userLogin);

router.post("/updateprofile", auth, multipartMiddleware, updateProfile);

router.post("/changepassword", auth, multipartMiddleware, changePassword);

router.post("/resetpassword", multipartMiddleware, resetPassword);

router.post("/createnewpassword", multipartMiddleware, createNewPassword);

router.post(
  "/activedeactive",
  auth,
  userrollauth,
  multipartMiddleware,
  activeDeactive
);

router.post("/profiledetails", auth, multipartMiddleware, customerProfile);

router.post("/alluser", auth, userrollauth, multipartMiddleware, getAllUsers);

router.post("/savelocation", auth, multipartMiddleware, saveLocation);

router.post("/getuserlocation", auth, multipartMiddleware, getUserLocation);

router.post("/deleteuser", auth, userrollauth, multipartMiddleware, deleteUser);

router.post(
  "/allcustomer",
  auth,
  userrollauth,
  multipartMiddleware,
  getAllCustomer
);

router.post(
  "/allserviceprovider",
  auth,
  multipartMiddleware,
  getAllServiceProvider
);

router.post(
  "/edituserdata",
  auth,
  userrollauth,
  upload.single("profile_picture"),
  adminEditUserData
);

router.post("/verify", userrollauth, multipartMiddleware, verifyUser);

module.exports = router;
