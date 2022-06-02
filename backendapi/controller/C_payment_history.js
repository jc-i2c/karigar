const PaymentHistory = require("../models/M_payment_history");
const ServiceHistory = require("../models/M_service_history");
const ChatRequest = require("../models/M_chat_request");

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
      let serviceProvider = getQry.serviceproviderid;

      let createPaymentHistory = new PaymentHistory({
        servicehistoryid: servicehistoryid,
        customerid: customerid,
        amount: amount,
        transactionid: transactionid,
        paymentstatus: paymentstatus,
      });

      const createHistory = await createPaymentHistory.save();

      if (createHistory) {
        const getQry1 = await ChatRequest.findOne().where({
          customerid: customerid,
          serviceprovid: serviceProvider,
        });

        const getQry2 = await ChatRequest.findOne().where({
          customerid: serviceProvider,
          serviceprovid: customerid,
        });

        let findData = getQry1 ? getQry1 : getQry2;

        if (!findData) {
          var chatRequest = new ChatRequest({
            customerid: customerid,
            serviceprovid: serviceProvider,
            chatstatus: 2,
          });

          const createChat = await chatRequest.save();

          // console.log(createChat, "createChat");
        }

        return res.send({
          status: true,
          message: `Payment completed.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Payment not completed.`,
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
