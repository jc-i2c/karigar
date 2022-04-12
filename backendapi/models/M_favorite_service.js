const mongoose = require("mongoose");

const favoriteServiceSchema = new mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
    subserviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subservices",
      required: [true, "Sub service Id is required."],
    },
    isfavorite: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-favorite, false-Unfavorite
    },
  },
  {
    timestamps: true,
  }
);

favoriteServiceSchema.methods.toJSON = function () {
  const favoriteService = this;
  const favoriteServiceObj = favoriteService.toObject();
  delete favoriteServiceObj.__v;
  delete favoriteServiceObj.createdAt;
  delete favoriteServiceObj.updatedAt;
  return favoriteServiceObj;
};

module.exports = mongoose.model("favoriteservice", favoriteServiceSchema);
