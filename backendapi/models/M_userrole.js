const mongoose = require("mongoose");

const UserroleSchema = new mongoose.Schema(
  {
    rolename: {
      type: String,
      unique: [true, "User rolename is already exists."],
      required: [true, "User rolename is required."],
      lowercase: [true, "Lower case only accept."],
    },
    systemmodulesid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "system_modules",
        required: [true, "System modules Id is required."],
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserroleSchema.methods.toJSON = function () {
  const userrole = this;
  const userroleObj = userrole.toObject();
  delete userroleObj.__v;
  return userroleObj;
};

module.exports = mongoose.model("userrole", UserroleSchema);
