const router = require("express").Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const auth = require("../middleware/auth");

const {
  createOffer,
  updateOffer,
  getAllOffer,
  deleteOffer,
  changeOfferStatus,
  getAllOfferAdmin,
  userOffer,
} = require("../controller/C_offer");

router.post("/create", auth, multipartMiddleware, createOffer);

router.post("/update", auth, multipartMiddleware, updateOffer);

router.post("/getall", auth, multipartMiddleware, getAllOffer);

router.post("/delete", auth, multipartMiddleware, deleteOffer);

router.post("/changestatus", auth, multipartMiddleware, changeOfferStatus);

router.post("/getalloffer", auth, multipartMiddleware, getAllOfferAdmin);

router.post("/useroffer", auth, multipartMiddleware, userOffer);

module.exports = router;
