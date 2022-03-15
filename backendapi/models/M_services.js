const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema(
  {
    servicename: {
      type: String,
      required: [true, "Service name is required."],
    },
    serviceimage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ServicesSchema.methods.toJSON = function () {
  const services = this;
  const servicesObj = services.toObject();
  delete servicesObj.__v;
  delete servicesObj.createdAt;
  delete servicesObj.updatedAt;
  return servicesObj;
};

module.exports = mongoose.model("services", ServicesSchema);
