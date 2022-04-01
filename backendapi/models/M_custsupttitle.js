const mongoose = require("mongoose");

const custSupTitleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Customer support title is required."],
      unique: [true, "Customer support title is must be unique."],
    },
  },
  {
    timestamps: true,
  }
);

custSupTitleSchema.methods.toJSON = function () {
  const custSupTitle = this;
  const custSupTitleObj = custSupTitle.toObject();
  delete custSupTitleObj.__v;
  delete custSupTitleObj.createdAt;
  delete custSupTitleObj.updatedAt;
  return custSupTitleObj;
};

module.exports = mongoose.model("cussuptitle", custSupTitleSchema);
