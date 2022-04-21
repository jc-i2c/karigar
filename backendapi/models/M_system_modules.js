const mongoose = require("mongoose");

const systemModulesSchema = new mongoose.Schema(
  {
    modulesname: {
      type: String,
      unique: [true, "Modules name is already exists."],
      required: [true, "Modules name is required."],
    },
    modulespermission: [
      {
        name: {
          type: String,
          required: [true, "Modules permission is required."],
        },
        id: {
          type: String,
          required: [true, "Modules permission is required."],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

systemModulesSchema.methods.toJSON = function () {
  const systemModules = this;
  const systemModulesObj = systemModules.toObject();
  delete systemModulesObj.__v;
  delete systemModulesObj.createdAt;
  delete systemModulesObj.updatedAt;
  return systemModulesObj;
};

module.exports = mongoose.model("system_modules", systemModulesSchema);
