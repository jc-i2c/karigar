const { string } = require("joi");
const mongoose = require("mongoose");

const systemModulesSchema = new mongoose.Schema(
  {
    modulesname: {
      type: String,
      unique: [true, "Modules name is already exists."],
      required: [true, "Modules name is required."],
      lowercase: [true, "Lower case only accept."],
    },
  },
  {
    timestamps: true,
  }
);

systemModulesSchema.methods.toJSON = function () {
  const systemModules = this;
  const systemModulesObj = systemModules.toObject();
  delete systemModulesObj.__v;
  return systemModulesObj;
};

module.exports = mongoose.model("system_modules", systemModulesSchema);
