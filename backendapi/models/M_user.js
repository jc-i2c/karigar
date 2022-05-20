const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    emailaddress: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter valid email.",
      },
      required: [true, "Email address is required."],
      unique: [true, "Email address is already exists."],
    },
    password: {
      type: String,
      trim: true,
      minLength: [6, "Password should be at least six characters long."],
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name must ne 3 character."],
    },
    mobilenumber: {
      type: Number,
      trim: true,
      minlength: [10, "Minimun mobile number number 10 digit is required."],
      maxlength: [10, "Maximun mobile number number 10 digit is required."],
    },
    gender: {
      type: Number,
      enum: [1, 2], // 1-male, 2-female
    },
    otp: {
      type: Number,
      length: [6, "OTP must be 6 digit."],
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-User_verified, false-User_not_verified
    },
    userroll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userrole",
      required: [true, "Userrole Id is required."],
    },
    isactive: {
      type: Boolean,
      enum: [true, false],
      default: true, // true-User_Active, false-User_Deactive
    },
    location: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.__v;
  delete userObj.createdAt;
  delete userObj.updatedAt;
  return userObj;
};

// Bcrypt password before save
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

module.exports = mongoose.model("user", UserSchema);
