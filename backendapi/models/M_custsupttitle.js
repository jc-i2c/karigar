const mongoose = require("mongoose");

const custSupTitleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Customer support title is required."],
    unique: [true, "Customer support title is must be unique."],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

custSupTitleSchema.methods.toJSON = function () {
  const custSupTitle = this;
  const custSupTitleObj = custSupTitle.toObject();
  delete custSupTitleObj.__v;
  return custSupTitleObj;
};

module.exports = mongoose.model("cussuptitle", custSupTitleSchema);
