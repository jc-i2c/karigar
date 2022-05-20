const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: [true, "Name is already exists."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User Id is required."],
    },
    subserviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subservices",
      required: [true, "Sub service Id is required."],
    },
    price: {
      type: Number,
      default: 0,
    },
    servicedetails: { type: Array },
    isactive: {
      type: Boolean,
      enum: [true, false],
      default: true, // true-Active, false-Deactive
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
);

ServiceProviderSchema.methods.toJSON = function () {
  const serviceProvider = this;
  const serviceProviderObj = serviceProvider.toObject();
  delete serviceProviderObj.__v;
  delete serviceProviderObj.createdAt;
  delete serviceProviderObj.updatedAt;
  return serviceProviderObj;
};

module.exports = mongoose.model("serviceprovider", ServiceProviderSchema);
