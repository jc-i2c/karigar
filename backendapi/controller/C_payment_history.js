const PaymentHistory = require("../models/M_payment_history");
const ServiceHistory = require("../models/M_service_history");
const ChatRequest = require("../models/M_chat_request");
const Serviceprovider = require("../models/M_serviceprovider");
const ChatRoom = require("../models/M_chat_room");
const Chat = require("../models/M_chat");
var moment = require("moment");
const mongoose = require("mongoose");

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

    let getTime = new Date();
    getTime = moment(getTime).format("hh:mm A");

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

      // find service provider id (means user who is providing the service booked)
      const providerId = await Serviceprovider.findById(
        getQry.serviceproviderid
      ).select("userid");

      // set chatRequest to true
      // add default message in chat table
      if (createHistory) {
        const getQry1 = await ChatRequest.findOne().where({
          customerid: customerid,
          serviceprovid: providerId.userid,
        });

        if (!getQry1) {
          var chatRequest = new ChatRequest({
            customerid: customerid,
            serviceprovid: providerId.userid,
            chatstatus: 2,
          });

          const createChatRequest = await chatRequest.save();

          // create room and add default message

          const chatrequestid = createChatRequest._id;
          // const { userid, otheruserid, chatrequestid } = req.body;

          const findRoom = await ChatRoom.findOne().where({
            chatrequestid: new mongoose.Types.ObjectId(chatrequestid),
          });

          if (!findRoom) {
            var chatRoom = new ChatRoom({
              userid: customerid,
              otheruserid: providerId.userid,
              chatrequestid: chatrequestid,
              lastmsg: "Service booked successfully",
              msgtime: getTime,
            });

            const createChatRoom = await chatRoom.save();

            if (createChatRoom) {
              // Craete default message.

              var chatCreate = new Chat({
                chatroomid: createChatRoom._id,
                senderid: providerId.userid,
                receiverid: customerid,
                message: "Service booked successfully",
              });

              const createdChat = await chatCreate.save();

              return res.send({
                status: true,
                message: `Payment completed.`,
              });
            }
          }
        } else {
          // we have chat request over here but we don't that there is a room exist or not.
          // it's because user might have requested for chat before booking service and
          // service provide might reject to chat. that can prevent room creation.
          const chatrequestid = getQry1._id;

          const findRoom = await ChatRoom.findOne().where({
            chatrequestid: new mongoose.Types.ObjectId(chatrequestid),
          });

          if (!findRoom) {
            var chatRoom = new ChatRoom({
              userid: customerid,
              otheruserid: providerId.userid,
              chatrequestid: chatrequestid,
              lastmsg: "Service booked successfully",
              msgtime: getTime,
            });

            const createChatRoom = await chatRoom.save();

            if (createChatRoom) {
              // Craete default message.
              var chatCreate = new Chat({
                chatroomid: createChatRoom._id,
                senderid: providerId.userid,
                receiverid: customerid,
                message: "Service booked successfully",
              });

              const createdChat = await chatCreate.save();

              return res.send({
                status: true,
                message: `Payment completed.`,
              });
            }
          } else {
            // create new chat with default message for new services.
            var chatCreate = new Chat({
              chatroomid: findRoom._id,
              senderid: providerId.userid,
              receiverid: customerid,
              message: "Service booked successfully",
            });

            const createdChat = await chatCreate.save();

            return res.send({
              status: true,
              message: `Payment completed.`,
            });
          }
        }
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
