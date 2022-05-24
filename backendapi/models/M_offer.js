const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  subserviceid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subservices",
    required: [true, "Sub service Id is required."],
  },
  serviceproviderid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceprovider",
    required: [true, "Service provider Id is required."],
  },
  currentprice: {
    type: Number,
    required: [true, "Current price is required."],
  },
  actualprice: {
    type: Number,
    required: [true, "Actual  price is required."],
  },
  isactive: {
    type: Boolean,
    enum: [true, false],
    default: true, // true-Offer_Active, false-Offer_Deactive
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

OfferSchema.methods.toJSON = function () {
  const offer = this;
  const offerObj = offer.toObject();
  delete offerObj.__v;
  delete offerObj.createdAt;
  delete offerObj.updatedAt;
  return offerObj;
};

module.exports = mongoose.model("offer", OfferSchema);
