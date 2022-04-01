const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
  {
    privacypolicy: {
      type: String,
      required: [true, "Privacy policy description is required."],
      unique: [true, "Privacy policy description is must be unique."],
    },
  },
  {
    timestamps: true,
  }
);

privacyPolicySchema.methods.toJSON = function () {
  const privacyPolicy = this;
  const privacyPolicyObj = privacyPolicy.toObject();
  delete privacyPolicyObj.__v;
  delete privacyPolicyObj.createdAt;
  delete privacyPolicyObj.updatedAt;
  return privacyPolicyObj;
};

module.exports = mongoose.model("privacypolicy", privacyPolicySchema);
