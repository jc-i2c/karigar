const ChatRequest = require("../models/M_chat_request");
const ChatRoom = require("../models/M_chat_room");
const Chat = require("../models/M_chat");
var moment = require("moment");

const jwt = require("jsonwebtoken");
const config = process.env;

const { chatReqStatusVal } = require("../helper/joivalidation");

let mongoose = require("mongoose");

// Create chat request API.
const createChatReq = async (data) => {
  try {
    let senderid = data.senderid;
    let receiverid = data.receiverid;
    let message = data.message;

    const getQryChat = await ChatRequest.find().where({
      customerid: senderid,
      serviceprovid: receiverid,
    });

    if (getQryChat.length < 0) {
      var chatRequest = new ChatRequest({
        customerid: customerid,
        serviceprovid: serviceprovid,
      });

      await chatRequest.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Change chat request status API.
const changeStatus = async (getData) => {
  try {
    console.log(getData, "getData");
    let data = {
      chatrequestid: getData.chatreqid,
      chatstatus: getData.status,
    };

    // If customer request accepted then create one room.
    if (data.chatstatus == "2" || data.chatstatus == 2) {
      const findRoom = await ChatRoom.findOne().where({
        chatrequestid: new mongoose.Types.ObjectId(getData.chatreqid),
      });

      console.log(findRoom, "findRoom");

      if (findRoom == null || findRoom == undefined) {
        var chatRoom = new ChatRoom({
          userid: getData.customerid,
          otheruserid: getData.serviceprovid,
          chatrequestid: getData.chatreqid,
        });

        const insertQry = await chatRoom.save();
      } else {
        console.log("Chat room already available.");
      }
    }

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
              return result;
            }
          }
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
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
        return findStatus;
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all chat Request based on service provider Id API.
const getAllChatRequest = async (data) => {
  try {
    if (data) {
      var token = data.split(" ");
      token = token[0];

      const decoded = jwt.verify(token, config.TOKEN_KEY);

      const getQry = await ChatRequest.find()
        .where({
          serviceprovid: decoded.id,
        })
        .populate({ path: "customerid", select: "name" })
        .populate({ path: "serviceprovid", select: "name image" });

      if (getQry.length > 0) {
        let findData = [];

        await Promise.all(
          getQry.map(async (data) => {
            let resData = {};
            resData = data.toObject();

            let findRoom = await ChatRoom.findOne({
              chatrequestid: resData._id,
            }).select("lastmsg msgtime");

            resData = {
              ...resData,
              lastmsg: findRoom.lastmsg,
              msgtime: findRoom.msgtime,
            };

            findData = [...findData, resData];
          })
        );

        if (findData.length > 0) {
          return findData;
        }
      }
    } else {
      return "Token is required.";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all chat Request based on customer Id API.
const getAllCusChatRequest = async (data) => {
  try {
    if (data) {
      var token = data.split(" ");
      token = token[0];

      const decoded = jwt.verify(token, config.TOKEN_KEY);

      let getQry = await ChatRequest.find()
        .where({
          customerid: decoded.id,
        })
        .populate({ path: "customerid", select: "name" })
        .populate({ path: "serviceprovid", select: "name profile_picture" });

      if (getQry.length > 0) {
        let findData = [];
        let resData = {};

        getQry.forEach((data) => {
          resData = data.toObject();

          delete resData.updatedAt; // delete person["updatedAt"]
          delete resData.__v; // delete person["__v"]

          // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          createDate = resData.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          resData.createdAt = moment(createDate).format("DD-MM-YYYY HH:MM:SS");

          findData.push(resData);
        });
        if (findData) {
          return findData;
        }
      }
    } else {
      return "Token is required.";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all message based on room Id API.
const sendMessage = async (data) => {
  try {
    // Chat request code.
    let getTime = new Date();
    getTime = moment(getTime).format("hh:mm A");

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

    let chatReqData = firstChatReq ? firstChatReq : secondChatReq;
    // console.log(chatReqData, "chatReqData");
    if (chatReqData) {
      // Room code.
      if (chatReqData.chatstatus === 2 || chatReqData.chatstatus == 2) {
        const getQryRoom = await ChatRoom.findOne().where({
          chatrequestid: chatReqData._id,
        });

        if (getQryRoom) {
          // Update last msg into CHATROOM API.
          await ChatRoom.findOneAndUpdate(
            { _id: getQryRoom._id },
            { sendby: senderid, lastmsg: message, msgtime: getTime },
            { new: true }
          );

          // Chat code.
          if (getQryRoom.chatactive) {
            var chatCreate = new Chat({
              chatroomid: getQryRoom._id,
              senderid: senderid,
              receiverid: receiverid,
              message: message,
              msgtime: getTime,
            });

            const chatCraeteQry = await chatCreate.save();

            if (chatCraeteQry) {
              return chatCraeteQry;
            }
          }
        } else {
          // Room code.
          let getTime = new Date();
          getTime = moment(getTime).format("hh:mm A");

          var chatRoom = new ChatRoom({
            chatrequestid: chatReqData._id,
            userid: senderid,
            otheruserid: receiverid,
            sendby: senderid,
            lastmsg: message,
            msgtime: getTime,
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
              return chatCraeteQry;
            }
          }
        }
      }
    } else {
      var chatRequest = new ChatRequest({
        customerid: senderid,
        serviceprovid: receiverid,
      });

      const chatCraeteQry = await chatRequest.save();

      if (chatCraeteQry) {
        // Room code.
        var chatRoom = new ChatRoom({
          chatrequestid: chatReqData._id,
          userid: senderid,
          otheruserid: receiverid,
          sendby: senderid,
          lastmsg: message,
          msgtime: getTime,
        });

        const roomCraeteQry = await chatRoom.save();

        if (roomCraeteQry) {
          // Chat code.
          var chatCreate = new Chat({
            chatroomid: roomCraeteQry._id,
            senderid: senderid,
            receiverid: receiverid,
            message: message,
            msgtime: getTime,
          });

          const chatCraeteQry = await chatCreate.save();

          if (chatCraeteQry) {
            return chatCraeteQry;
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

// Create chat room and get all old chat API.
const createChatRoom = async (data) => {
  try {
    const { customerid, serviceprovid, chatrequestid } = data;
    console.log(data, "data");

    const findRoom = await ChatRoom.findOne().where({
      chatrequestid: new mongoose.Types.ObjectId(chatrequestid),
    });

    if (findRoom) {
      const getQry = await Chat.find().where({
        chatroomid: findRoom._id,
      });

      let newArray = [];
      getQry.map((list) => {
        let newObj = {};
        newObj = list.toObject();

        // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
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
        sendby: serviceprovid,
      });

      await chatRoom.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createChatReq,
  changeStatus,
  checkStatus,
  getAllChatRequest,
  getAllCusChatRequest,
  sendMessage,
  createChatRoom,
};
