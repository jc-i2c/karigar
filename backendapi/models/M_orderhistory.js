const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema(
  {
    addresstype: {
      type: Number,
      enum: [1, 2],
      default: 1, // 1-office, 2-home
      required: [true, "Address type is required."],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address name is required."],
      },
      area: {
        type: String,
        required: [true, "Area name is required."],
      },
      pincode: {
        type: Number,
        required: [true, "Pincode is required."],
      },
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    orderdate: {
      type: Date,
      required: [true, "Order date is required."], // 14-03-2022
    },
    session: {
      type: String,
      enum: [1, 2],
      default: 1,
      required: [true, "Session is required."], // 1-Morning, 2-Afternooon
    },
    time: { type: String, required: [true, "Time is required."] }, // 11:50
  },
  {
    timestamps: true,
  }
);

OrderHistorySchema.methods.toJSON = function () {
  const orderHistory = this;
  const orderHistoryObj = orderHistory.toObject();
  delete orderHistoryObj.__v;
  delete orderHistoryObj.createdAt;
  delete orderHistoryObj.updatedAt;
  return orderHistoryObj;
};

module.exports = mongoose.model("serviceprovider", OrderHistorySchema);
