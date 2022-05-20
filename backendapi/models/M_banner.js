const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    bannertitle: {
      type: String,
      required: [true, "Banner name is required."],
      unique: [true, "Banner name is must be unique."],
    },
    bannersubtitle: {
      type: String,
      required: [true, "Banner subtitle is required."],
      unique: [true, "Banner subtitle is must be unique."],
    },
    bannerimage: {
      type: String,
      required: [true, "Banner image is required."],
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
);

BannerSchema.methods.toJSON = function () {
  const banner = this;
  const bannerObj = banner.toObject();
  delete bannerObj.__v;
  return bannerObj;
};

module.exports = mongoose.model("banner", BannerSchema);
