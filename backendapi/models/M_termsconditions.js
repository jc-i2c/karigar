const mongoose = require("mongoose");

const termsConditionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Terms condition title is required."],
      unique: [true, "Terms condition title is must be unique."],
    },
    description: {
      type: String,
      required: [true, "Terms condition description is required."],
      unique: [true, "Terms condition description is must be unique."],
    },
  },
  {
    timestamps: true,
  }
);

termsConditionSchema.methods.toJSON = function () {
  const termsConditions = this;
  const termsConditionsObj = termsConditions.toObject();
  delete termsConditionsObj.__v;
  delete termsConditionsObj.createdAt;
  delete termsConditionsObj.updatedAt;
  return termsConditionsObj;
};

module.exports = mongoose.model("termsconditions", termsConditionSchema);
