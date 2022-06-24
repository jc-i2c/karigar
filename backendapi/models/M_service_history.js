const mongoose = require("mongoose");

const serviceDateTimeSchema = new mongoose.Schema(
  {
    booking_request_sent: { type: String },
    accept: { type: String },
    job_started: { type: String },
    job_completed: { type: String },
    reject: { type: String },
  },
  { _id: false }
);

const ServiceHistorySchema = new mongoose.Schema({
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
    type: String,
    required: [true, "Address is required."],
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  servicedate: {
    type: Date,
    required: [true, "Service date is required."], // 2022-03-12
  },
  sessiontime: {
    type: String,
    // required: [true, "Session time is required"], // 10:00 AM, 07:45 PM etc.
  },
  servicestatus: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    default: 0, // 0-BOOKING_REQUEST_SENT(PENDING), 1-ACCEPT, 2-JOB_STARTED 3-JOB_COMPLETED 4-REJECT
    required: [true, "Service status is required."],
  },
  bookingdate: {
    type: String,
    required: [true, "booking date is required."], // 14 March 10:00 PM
  },
  service_date_time: {
    type: serviceDateTimeSchema,
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

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
