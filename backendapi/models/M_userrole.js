const mongoose = require("mongoose");

const UserroleSchema = new mongoose.Schema(
  {
    rolename: {
      type: String,
      unique: [true, "User rolename is already exists."],
      required: [true, "User rolename is required."],
    },
    permissions: [
      {
        systemmodulesid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "system_modules",
          required: [true, "System modules Id is required."],
        },
        access: [
          {
            type: String,
            required: [true, "Modules permission is required."],
          },
        ],
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
  delete userroleObj.createdAt;
  delete userroleObj.updatedAt;
  return userroleObj;
};

module.exports = mongoose.model("userrole", UserroleSchema);
