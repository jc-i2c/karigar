const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    bannername: {
      type: String,
      required: [true, "Banner name is required."],
      unique: [true, "Banner name is must be unique."],
    },
    bannerimage: {
      type: String,
      required: [true, "Banner image is required."],
    },
  },
  {
    timestamps: true,
  }
);

BannerSchema.methods.toJSON = function () {
  const banner = this;
  const bannerObj = banner.toObject();
  delete bannerObj.__v;
  delete bannerObj.createdAt;
  delete bannerObj.updatedAt;
  return bannerObj;
};

module.exports = mongoose.model("banner", BannerSchema);
