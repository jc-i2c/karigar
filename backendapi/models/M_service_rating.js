const mongoose = require("mongoose");

const ServiceRatingSchema = new mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
    servicehistoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servicehistory",
      required: [true, "Service history Id is required."],
    },
    serviceproviderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceprovider",
      required: [true, "Service provider Id is required."],
    },
    rate: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
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

ServiceRatingSchema.methods.toJSON = function () {
  const serviceRating = this;
  const serviceRatingObj = serviceRating.toObject();
  delete serviceRatingObj.__v;
  delete serviceRatingObj.createdAt;
  delete serviceRatingObj.updatedAt;
  return serviceRatingObj;
};

module.exports = mongoose.model("servicerating", ServiceRatingSchema);
