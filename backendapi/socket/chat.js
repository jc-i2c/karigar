const ChatRequest = require("../models/M_chat_request");
const ChatRoom = require("../models/M_chat_room");
const Chat = require("../models/M_chat");

const { chatReqStatusVal, loginDataVal } = require("../helper/joivalidation");

// Create chat request API.
const createChatReq = async (data, req, res, next) => {
  try {
    let senderid = data.senderid;
    let receiverid = data.receiverid;
    let message = data.message;

    const getQryChat = await ChatRequest.find().where({
      customerid: senderid,
      serviceprovid: receiverid,
    });

    if (getQryChat.length > 0) {
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

      const insertQryChat = await chatRequest.save();

      if (insertQryChat) {
        console.log(`Chat request created.`);
      } else {
        console.log(`Chat request not created.`);
      }
    }
  } catch (error) {
    // console.log(error, "Socket ERROR");
    throw new Error(error.message);
    // next(error);
  }
};

// Change chat request status API.
const changeStatus = async (msgData, req, res, next) => {
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
          } else {
            console.log(`Chat request status not changed.`);
          }
        } else {
          console.log(`Chat request status is not valid.`);
        }
      } else {
        console.log(`Chat request not found into system.`);
      }
    }
  } catch (error) {
    throw new Error(error.message);
    // console.log(error, "ERROR");
    // next(error);
  }
};

// Get all chat Request based on service provider Id API.
const getAllChatRequest = async (data) => {
  try {
    const { serviceprovid } = data;

    let getQry = await ChatRequest.find().where({
      serviceprovid: serviceprovid,
    });

    if (getQry.length > 0) {
      let findData = [];
      let resData = {};

      getQry.forEach((data) => {
        resData = data.toObject();

        delete resData.updatedAt; // delete person["updatedAt"]
        delete resData.__v; // delete person["__v"]

        // Set chat request status.
        if (resData.chatstatus == 1) {
          resData.chatstatus = "Pending";
        } else if (resData.chatstatus == 2) {
          resData.chatstatus = "Accept";
        } else if (resData.chatstatus == 3) {
          resData.chatstatus = "Reject";
        }

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        findData.push(resData);
      });

      console.log(findData, "findData");

      return res.send({
        status: true,
        message: `${getQry.length} Data found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Data not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all chat Request based on customer Id API.
const getAllCusChatRequest = async (data) => {
  try {
    const { customerid } = data;

    let getQry = await ChatRequest.find().where({
      customerid: customerid,
    });

    if (getQry.length > 0) {
      let findData = [];
      let resData = {};

      getQry.forEach((data) => {
        resData = data.toObject();

        delete resData.updatedAt; // delete person["updatedAt"]
        delete resData.__v; // delete person["__v"]

        // Set chat request status.
        if (resData.chatstatus == 1) {
          resData.chatstatus = "Pending";
        } else if (resData.chatstatus == 2) {
          resData.chatstatus = "Accept";
        } else if (resData.chatstatus == 3) {
          resData.chatstatus = "Reject";
        }

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        findData.push(resData);
      });

      console.log(findData, "findData");

      return res.send({
        status: true,
        message: `${getQry.length} Data found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Data not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all message based on room Id API.
const getAllMessage = async (data, req, res, next) => {
  try {
    const getQry = await Chat.find().where({
      chatroomid: data.chatroomid,
    });

    if (getQry.length > 0) {
      getQry.forEach((element) => {
        console.log(element.message, "element.message");
      });
    } else {
      console.log(`No chat found into system.`);
    }
  } catch (error) {
    throw new Error(error.message);
    // console.log(error, "ERROR");
    // next(error);
  }
};

// Get all message based on room Id API.
const sendMessage = async (data, req, res, next) => {
  try {
    // Chat request code.
    let senderid = data.senderid;
    let receiverid = data.receiverid;
    let message = data.message;

    const firstChatReq = await ChatRequest.findOne().where({
      customerid: senderid,
      serviceprovid: receiverid,
    });

    const secondChatReq = await ChatRequest.findOne().where({
      customerid: receiverid,
      serviceprovid: senderid,
    });

    if (firstChatReq || secondChatReq) {
      // Room code.
      let chatReqData = firstChatReq ? firstChatReq : secondChatReq;

      if (chatReqData.chatstatus === 2 || chatReqData.chatstatus == 2) {
        const getQryRoom = await ChatRoom.findOne().where({
          chatrequestid: chatReqData._id,
        });

        if (getQryRoom) {
          // Chat code.
          if (getQryRoom.chatactive) {
            var chatCreate = new Chat({
              chatroomid: getQryRoom._id,
              senderid: senderid,
              receiverid: receiverid,
              message: message,
            });

            const chatCraeteQry = await chatCreate.save();

            if (chatCraeteQry) {
              console.log(`New chat created.`);
              // return res.send({
              //   status: true,
              //   message: `New chat created.`,
              // });
            } else {
              console.log(`Chat not created.`);
              // return res.send({
              //   status: false,
              //   message: `New chat not created.`,
              // });
            }
          } else {
            console.log(`Chat room is block.`);
            // return res.send({
            //   status: false,
            //   message: `Chat room is block.`,
            // });
          }
        } else {
          // Room code.
          var chatRoom = new ChatRoom({
            chatrequestid: chatReqData._id,
            userid: senderid,
            otheruserid: receiverid,
          });

          const roomCraeteQry = await chatRoom.save();

          if (roomCraeteQry) {
            // Chat code.
            var chatCreate = new Chat({
              chatroomid: roomCraeteQry._id,
              senderid: senderid,
              receiverid: receiverid,
              message: message,
            });

            const chatCraeteQry = await chatCreate.save();

            if (chatCraeteQry) {
              console.log(`New chat created.`);
              // return res.send({
              //   status: true,
              //   message: `New chat created.`,
              // });
            } else {
              console.log(`Chat not created.`);
              // return res.send({
              //   status: false,
              //   message: `New chat not created.`,
              // });
            }
          }
        }
      } else {
        // Pending or reject status only show.
        if (chatReqData.chatstatus === 1 || chatReqData.chatstatus == 1) {
          console.log(`Your request is pending.`);
          // return res.send({
          //   status: true,
          //   message: `Your request is pending.`,
          // });
        } else if (
          chatReqData.chatstatus === 3 ||
          chatReqData.chatstatus == 3
        ) {
          console.log(`Your request is reject.`);
          // return res.send({
          //   status: true,
          //   message: `Your request is reject.`,
          // });
        }
      }
    } else {
      var chatRequest = new ChatRequest({
        customerid: senderid,
        serviceprovid: receiverid,
      });

      const chatCraeteQry = await chatRequest.save();

      if (chatCraeteQry) {
        var chatRoom = new ChatRoom({
          chatrequestid: chatCraeteQry._id,
          userid: senderid,
          otheruserid: receiverid,
        });

        const roomCraeteQry = await chatRoom.save();

        if (roomCraeteQry) {
          // console.log(`Chat room created.`);
          // Chat code.
          var chatCreate = new Chat({
            chatroomid: roomCraeteQry._id,
            senderid: senderid,
            receiverid: receiverid,
            message: message,
          });

          const chatCraeteQry = await chatCreate.save();

          if (chatCraeteQry) {
            console.log(`New chat created.`);
            // return res.send({
            //   status: true,
            //   message: `New chat created.`,
            // });
          } else {
            console.log(`Chat not created.`);
            // return res.send({
            //   status: false,
            //   message: `New chat not created.`,
            // });
          }
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
    // console.log(error, "ERROR");
    // next(error);
  }
};

module.exports = {
  createChatReq,
  changeStatus,
  getAllChatRequest,
  getAllCusChatRequest,
  getAllMessage,
  sendMessage,
};
