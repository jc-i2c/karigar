const ChatRequest = require("../models/M_chat_request");
const ChatRoom = require("../models/M_chat_room");
const Chat = require("../models/M_chat");
var moment = require("moment");

const { chatReqStatusVal, loginDataVal } = require("../helper/joivalidation");
const { default: mongoose } = require("mongoose");

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
const changeStatus = async (getData) => {
  try {
    let data = {
      chatrequestid: getData.chatreqid,
      chatstatus: getData.status,
    };

    if (data.chatstatus == "3" || data.chatstatus == 3) {
      // Delete chat request.
      await ChatRequest.findByIdAndDelete(data.chatrequestid);
    } else {
      // Joi validation.
      let { error } = chatReqStatusVal(data);

      if (error) {
        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        console.log("Error validation");
      } else {
        const getQry = await ChatRequest.findById(data.chatrequestid);

        if (getQry) {
          if (getQry) {
            const result = await ChatRequest.findByIdAndUpdate(
              getQry._id,
              {
                $set: { chatstatus: data.chatstatus },
              },
              { new: true }
            );

            if (result) {
              console.log("Chat request status changed.");
              return result;
            } else {
              console.log("Chat request status not changed.");
            }
          }
        } else {
          console.log("Chat request not found into system.");
        }
      }
    }
  } catch (error) {
    console.log(error, "ERROR");
    // next(error);
  }
};

// Check chat status accept or reject API.
const checkStatus = async (chatRequestId) => {
  try {
    if (chatRequestId) {
      let findStatus = await ChatRequest.findById(chatRequestId).select(
        "chatstatus"
      );

      if (findStatus) {
        // console.log(findStatus, "findStatus");
        return findStatus;
      } else {
        console.log("Chat request not find");
      }
    } else {
      console.log("Chat request Id is required");
    }
  } catch (error) {
    console.log(error, "ERROR");
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

        // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        createDate = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH");

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

        // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        createDate = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH");

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
const sendMessage = async (data) => {
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

              let newObj = chatCraeteQry.toObject();

              // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
              createDate = newObj.createdAt
                .toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, "");

              newObj.createdAt = moment(createDate).format("HH:MM");

              return newObj;
            } else {
              console.log(`Chat not created.`);
            }
          } else {
            console.log(`Chat room is block.`);
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

              let newObj = chatCraeteQry.toObject();

              // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
              createDate = newObj.createdAt
                .toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, "");

              newObj.createdAt = moment(createDate).format("HH:MM");

              return newObj;
            } else {
              console.log(`Chat not created.`);
            }
          }
        }
      } else {
        // Pending or reject status only show.
        if (chatReqData.chatstatus === 1 || chatReqData.chatstatus == 1) {
          console.log(`Your request is pending.`);
        } else if (
          chatReqData.chatstatus === 3 ||
          chatReqData.chatstatus == 3
        ) {
          console.log(`Your request is reject.`);
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

            let newObj = chatCraeteQry.toObject();

            // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
            createDate = newObj.createdAt
              .toISOString()
              .replace(/T/, " ")
              .replace(/\..+/, "");

            newObj.createdAt = moment(createDate).format("HH:MM");

            return newObj;
          } else {
            console.log(`Chat not created.`);
          }
        }
      }
    }
  } catch (error) {
    console.log(error, "ERROR");
    // next(error);
  }
};

// Create chat room and get all old chat API.
const createChatRoom = async (data) => {
  try {
    const { customerid, serviceprovid, chatrequestid } = data;

    const findRoom = await ChatRoom.findOne().where({
      chatrequestid: new mongoose.Types.ObjectId(chatrequestid),
    });

    if (findRoom) {
      // console.log(findRoom, "findRoom");

      const getQry = await Chat.find().where({
        chatroomid: findRoom._id,
      });

      let newArray = [];
      getQry.map((list) => {
        let newObj = {};
        newObj = list.toObject();

        // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        createDate = newObj.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        newObj.createdAt = moment(createDate).format("HH:MM");

        newArray.push(newObj);
      });

      return newArray;
    } else {
      var chatRoom = new ChatRoom({
        userid: customerid,
        otheruserid: serviceprovid,
        chatrequestid: chatrequestid,
      });

      const insertQry = await chatRoom.save();

      if (insertQry) {
        console.log(insertQry, "insertQry");
        console.log("Chat room created.");
      } else {
        console.log("Chat room not created.");
      }
    }
  } catch (error) {
    console.log(error, "ERROR");
    // next(error);
  }
};

module.exports = {
  createChatReq,
  changeStatus,
  checkStatus,
  getAllChatRequest,
  getAllCusChatRequest,
  getAllMessage,
  sendMessage,
  createChatRoom,
};
