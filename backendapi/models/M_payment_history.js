const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Customer Id is required."],
    },
    servicehistoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servicehistory",
      required: [true, "Service history Id is required."],
    },
    amount: {
      type: Number,
      default: 0,
      required: [true, "Payment amount is required."],
    },
    transactionid: {
      type: String,
      required: [true, "Payment transaction Id is required."],
    },
    paymentstatus: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-success, false-fail
      required: [true, "Payment status is required."],
    },
  },
  {
    timestamps: true,
  }
);

PaymentHistorySchema.methods.toJSON = function () {
  const paymentHistory = this;
  const paymentHistoryObj = paymentHistory.toObject();
  delete paymentHistoryObj.__v;
  delete paymentHistoryObj.createdAt;
  delete paymentHistoryObj.updatedAt;
  return paymentHistoryObj;
};

module.exports = mongoose.model("paymenthistory", PaymentHistorySchema);