const mongoose = require("mongoose");

const UserroleSchema = new mongoose.Schema(
  {
    rolename: {
      type: String,
      required: [true, "User rolename is required."],
    },
    roletag: {
      type: String,
      trim: true,
      unique: [true, "Role tag is already exists."],
      required: [true, "Role tag is required."],
      uppercase: [true, "Upper case only accept."],
    },
    systemmodulesid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "system_modules",
        required: [true, "System modules Id is required."],
      },
    ],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
);

UserroleSchema.methods.toJSON = function () {
  const userrole = this;
  const userroleObj = userrole.toObject();
  delete userroleObj.__v;
  return userroleObj;
};

module.exports = mongoose.model("userrole", UserroleSchema);
