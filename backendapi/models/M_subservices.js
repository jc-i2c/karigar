const mongoose = require("mongoose");

const SubServicesSchema = new mongoose.Schema(
  {
    subservicename: {
      type: String,
      required: [true, "Sub service name is required."],
    },
    subserviceimage: {
      type: String,
    },
    servicesid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      required: [true, "Service Id is required."],
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
);

SubServicesSchema.methods.toJSON = function () {
  const subServices = this;
  const subServicesObj = subServices.toObject();
  delete subServicesObj.__v;
  return subServicesObj;
};

module.exports = mongoose.model("subservices", SubServicesSchema);
