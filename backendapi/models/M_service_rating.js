const mongoose = require("mongoose");

const OrderRatingSchema = new mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
    orderhistoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servicehistory",
      required: [true, "Service order history Id is required."],
    },
    rate: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      default: "1",
      required: [true, "Rate is required."],
    },
    description: {
      type: String,
      required: [true, "Rate description is required."],
    },
  },
  {
    timestamps: true,
  }
);

OrderRatingSchema.methods.toJSON = function () {
  const orderRating = this;
  const orderRatingObj = orderRating.toObject();
  delete orderRatingObj.__v;
  delete orderRatingObj.createdAt;
  delete orderRatingObj.updatedAt;
  return orderRatingObj;
};

module.exports = mongoose.model("servicerating", OrderRatingSchema);
