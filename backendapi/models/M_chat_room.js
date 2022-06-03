const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  chatrequestid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatrequest",
    required: [true, "Chat request Id is required."],
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User Id is required."],
  },
  otheruserid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Other user Id is required."],
  },
  chatactive: {
    type: Boolean,
    enum: [true, false],
    default: true, // true-Active, false-Deactive
    required: [true, "Chat active or deactive status is required."],
  },
  sendby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  lastmsg: {
    type: String,
    default: "Now you can chat with each other",
  },
  msgtime: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

chatRoomSchema.methods.toJSON = function () {
  const chatRoom = this;
  const chatRoomObj = chatRoom.toObject();
  delete chatRoomObj.__v;
  delete chatRoomObj.createdAt;
  delete chatRoomObj.updatedAt;
  return chatRoomObj;
};

module.exports = mongoose.model("chatroom", chatRoomSchema);
