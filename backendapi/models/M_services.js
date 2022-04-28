const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema(
  {
    servicename: {
      type: String,
      required: [true, "Service name is required."],
      unique: [true, "Service name is already exists."],
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
  return servicesObj;
};

module.exports = mongoose.model("services", ServicesSchema);
