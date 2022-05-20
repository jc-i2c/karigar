const mongoose = require("mongoose");
var moment = require("moment");

const ServicesSchema = new mongoose.Schema({
  servicename: {
    type: String,
    required: [true, "Service name is required."],
    unique: [true, "Service name is already exists."],
  },
  serviceimage: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ServicesSchema.methods.toJSON = function () {
  const services = this;
  const servicesObj = services.toObject();
  delete servicesObj.__v;
  return servicesObj;
};

module.exports = mongoose.model("services", ServicesSchema);
