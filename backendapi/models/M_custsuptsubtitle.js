const mongoose = require("mongoose");

const custSupSubTitleSchema = new mongoose.Schema(
  {
    custsuptitleid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cussuptitle",
      required: [true, "Customer support title Id is required."],
    },
    subtitle: {
      type: String,
      unique: [true, "Customer support subtitle is must be unique."],
      required: [true, "Customer support subtitle is required."],
    },
    description: {
      type: String,
      required: [true, "Customer support description is required."],
      unique: [true, "Customer support description is must be unique."],
    },
  },
  {
    timestamps: true,
  }
);

custSupSubTitleSchema.methods.toJSON = function () {
  const custSupSubTitle = this;
  const custSupSubTitleObj = custSupSubTitle.toObject();
  delete custSupSubTitleObj.__v;
  delete custSupSubTitleObj.createdAt;
  delete custSupSubTitleObj.updatedAt;
  return custSupSubTitleObj;
};

module.exports = mongoose.model("cussupsubtitle", custSupSubTitleSchema);
