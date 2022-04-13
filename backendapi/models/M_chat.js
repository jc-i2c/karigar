const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatroomid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatroom",
      required: [true, "Chat room Id is required."],
    },
    senderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
    receiverid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Service provider Id is required."],
    },
    message: {
      type: String,
      required: [true, "Message is required."],
    },
    is_read: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-Seen, false-Unseen
      required: [true, "Message read status is required."],
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.methods.toJSON = function () {
  const chat = this;
  const chatObj = chat.toObject();
  delete chatObj.__v;
  delete chatObj.updatedAt;
  return chatObj;
};

module.exports = mongoose.model("chat", chatSchema);
