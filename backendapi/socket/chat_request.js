const ChatRequest = require("../models/M_chat_request");

const { chatReqStatusVal } = require("../helper/joivalidation");

// Create chat request API.
const createChatReq = async (msgData) => {
  try {
    const { customerid, serviceprovid } = msgData;

    const getQry = await ChatRequest.find().where({
      customerid: customerid,
      serviceprovid: serviceprovid,
    });

    console.log(getQry, "getQry");

    if (getQry.length > 0) {
      console.log(`Chat request is already created.`);
      // return res.send({
      //   status: true,
      //   message: `Chat request is already created.`,
      // });
    } else {
      var chatRequest = new ChatRequest({
        customerid: customerid,
        serviceprovid: serviceprovid,
      });

      const insertQry = await chatRequest.save();

      if (insertQry) {
        console.log(`Chat request created.`);

        // return res.send({
        //   status: true,
        //   message: `Chat request created.`,
        // });
      } else {
        console.log(`Chat request not created.`);
        // return res.send({
        //   status: false,
        //   message: `Chat request not created.`,
        // });
      }
    }
  } catch (error) {
    // console.log(error, "Socket ERROR");
    throw new Error(error.message);

    // next(error);
  }
};

// Change chat request status API.
const changeStatus = async (msgData) => {
  try {
    let data = {
      chatrequestid: msgData.chatrequestid,
      chatstatus: msgData.chatstatus,
    };

    // Joi validation.
    let { error } = chatReqStatusVal(data);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      console.log(errorMsg, "errorMsg");
      // return res.send({
      //   status: false,
      //   message: errorMsg,
      // });
    } else {
      const getQry = await ChatRequest.findById(data.chatrequestid);

      if (getQry) {
        if (data.chatstatus == 2 || data.chatstatus == 3) {
          const result = await ChatRequest.findByIdAndUpdate(getQry._id, {
            $set: { chatstatus: data.chatstatus },
          });
          if (result) {
            console.log(`Chat request status changed.`);
            // return res.send({
            //   status: true,
            //   message: `Chat request status changed.`,
            // });
          } else {
            console.log(`Chat request status not changed.`);
            // return res.send({
            //   status: false,
            //   message: `Chat request status not changed.`,
            // });
          }
        } else {
          console.log(`Chat request status is not valid.`);

          // return res.send({
          //   status: false,
          //   message: `Chat request status is not valid.`,
          // });
        }
      } else {
        console.log(`Chat request not found into system.`);
        // return res.send({
        //   status: false,
        //   message: `Chat request not found into system.`,
        // });
      }
    }
  } catch (error) {
    throw new Error(error.message);
    // console.log(error, "ERROR");
    // next(error);
  }
};

module.exports = { createChatReq, changeStatus };
