const mongoose = require("mongoose");
var moment = require("moment");

const ServicesSchema = new mongoose.Schema({
  servicename: {
    type: String,
    required: [true, "Service name is required."],
  },
  serviceimage: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
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
