const mongoose = require("mongoose");

const chatRequestSchema = new mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
    serviceprovid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Service provider Id is required."],
    },
    chatstatus: {
      type: Number,
      enum: [1, 2, 3],
      default: 1, // 1-Pending, 2-Accept, 3-Reject
      required: [true, "Chat status is required."],
    },
  },
  {
    timestamps: true,
  }
);

chatRequestSchema.methods.toJSON = function () {
  const chatRequest = this;
  const chatRequestObj = chatRequest.toObject();
  delete chatRequestObj.__v;
  delete chatRequestObj.createdAt;
  delete chatRequestObj.updatedAt;
  return chatRequestObj;
};

module.exports = mongoose.model("chatrequest", chatRequestSchema);
