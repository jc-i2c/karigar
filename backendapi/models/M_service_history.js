const mongoose = require("mongoose");

const ServiceHistorySchema = new mongoose.Schema(
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
      type: String,
      enum: [1, 2],
      default: 1, // 1-office, 2-home
      required: [true, "Address type is required."],
    },
    address: {
      type: String,
      required: [true, "Address is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    servicedate: {
      type: Date,
      required: [true, "Service date is required."], // 14-03-2022
    },
    servicetime: {
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
    servicestatus: {
      type: String,
      enum: ["0", "1", "2", "3", "4", "5"],
      default: "0", // 0-Booking_request_sent(Pending), 1-accept, 2-Booking_confirmed 3-Job_started 4-Job_Completed 5-Reject
      required: [true, "Service status is required."],
    },
    paymentstatus: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-Completed, false-Pending
      required: [true, "Payment status is required."],
    },
  },
  {
    timestamps: true,
  }
);

ServiceHistorySchema.servicedate;

ServiceHistorySchema.methods.toJSON = function () {
  const serviceHistory = this;
  const serviceHistoryObj = serviceHistory.toObject();
  delete serviceHistoryObj.__v;
  delete serviceHistoryObj.createdAt;
  delete serviceHistoryObj.updatedAt;
  return serviceHistoryObj;
};

module.exports = mongoose.model("servicehistory", ServiceHistorySchema);
