const PaymentHistory = require("../models/M_payment_history");
const ServiceHistory = require("../models/M_service_history");

// Create payment history API.
const createPayment = async (req, res, next) => {
  try {
    const {
      servicehistoryid,
      customerid,
      amount,
      transactionid,
      paymentstatus,
    } = req.body;

    const getQry = await ServiceHistory.findById(servicehistoryid);

    if (getQry) {
      let createPaymentHistory = new PaymentHistory({
        servicehistoryid: servicehistoryid,
        customerid: customerid,
        amount: amount,
        transactionid: transactionid,
        paymentstatus: paymentstatus,
      });

      const insertQry = await createPaymentHistory.save();

      if (insertQry) {
        const result = await ServiceHistory.findByIdAndUpdate(getQry._id, {
          $set: { paymentstatus: true },
        });

        return res.send({
          status: true,
          message: `Payment history created.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Payment history not created.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service history not found into system.`,
      });
    }
  } catch (err) {
    res.send(err);
  }
};

// Get payment API.
const getPayment = async (req, res, next) => {
  try {
    const { transactionid } = req.body;

    let getQry = await PaymentHistory.findOne().where({
      transactionid: transactionid,
    });

    getQry = getQry.toJSON();

    if (getQry) {
      if (getQry.paymentstatus) {
        getQry.paymentstatus = "success";
      } else {
        getQry.paymentstatus = "fail";
      }

      return res.send({
        status: true,
        message: `Payment found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `Payment not found into system.`,
      });
    }
  } catch (error) {}
};

module.exports = { createPayment, getPayment };
