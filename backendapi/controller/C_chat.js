const Chat = require("../models/M_chat");

// Create new chat API.
const createChat = async (req, res, next) => {
  try {
    const { chatroomid, senderid, receiverid, message } = req.body;

    var chatCreate = new Chat({
      chatroomid: chatroomid,
      senderid: senderid,
      receiverid: receiverid,
      message: message,
    });

    const insertQry = await chatCreate.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: `New chat created.`,
      });
    } else {
      return res.send({
        status: false,
        message: `Chat not created.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Chat message seen or unseen status chnages API.
const changeStatus = async (req, res, next) => {
  try {
    const { chatid } = req.body;

    const getQry = await Chat.findById(chatid);

    if (getQry) {
      if (getQry.is_read) {
        const result = await Chat.findByIdAndUpdate(chatid, {
          $set: { is_read: false },
        });

        if (result) {
          return res.send({
            status: true,
            message: `Message unseen.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Message not unseen error in database.`,
          });
        }
      } else {
        const result = await Chat.findByIdAndUpdate(chatid, {
          $set: { is_read: true },
        });

        if (result) {
          return res.send({
            status: true,
            message: `Message seen.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Message not seen error in database.`,
          });
        }
      }
    } else {
      return res.send({
        status: false,
        message: `Chat not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all message based on roomId API.
const getAllMessage = async (req, res, next) => {
  try {
    const { chatroomid } = req.body;

    const getQry = await Chat.find().where({
      chatroomid: chatroomid,
    });

    let totalCount = getQry.length;
    totalCount = parseInt(totalCount);

    if (getQry.length > 0) {
      return res.send({
        status: true,
        totalcount: totalCount,
        message: `Messages fount into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        totalcount: totalCount,
        message: `Messages not fount into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createChat,
  changeStatus,
  getAllMessage,
};
