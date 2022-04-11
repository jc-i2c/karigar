const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema(
  {
    serviceproviderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceprovider",
      required: [true, "Service provider Id is required."],
    },
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
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
    ordertime: {
      sessiontype: {
        type: String,
        enum: [1, 2],
        default: 1,
        required: [true, "Session type is required."], // 1-Morning, 2-Afternooon
      },
      sessiontime: {
        type: String,
        required: [true, "Session time is required"], // 10:00, 07:45 etc.
      },
    },
    orderstatus: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      default: "1", // 1-Booking_request_sent(Pending), 2-Booking_confirmed 3-Job_started 4-Job_Completed 5-Reject
      required: [true, "Order status is required."],
    },
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

module.exports = mongoose.model("servicehistory", OrderHistorySchema);
