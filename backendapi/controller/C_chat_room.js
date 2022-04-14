const ChatRoom = require("../models/M_chat_room");

// Create chat room API.
const createChatRoom = async (req, res, next) => {
  try {
    const { userid, otheruserid } = req.body;

    const getQry = await ChatRoom.find().where({
      userid: userid,
      otheruserid: otheruserid,
    });

    const getSecQry = await ChatRoom.find().where({
      userid: otheruserid,
      otheruserid: userid,
    });

    if (getQry.length > 0 || getSecQry.length > 0) {
      return res.send({
        status: true,
        message: `Chat room is already created.`,
      });
    } else {
      var chatRoom = new ChatRoom({
        userid: userid,
        otheruserid: otheruserid,
      });

      const insertQry = await chatRoom.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Chat room created.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Chat room not created.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Change chat room status API.
const changeStatus = async (req, res, next) => {
  try {
    let { chatroomid } = req.body;

    const getQry = await ChatRoom.findById(chatroomid);

    if (getQry) {
      if (getQry.chatactive) {
        const result = await ChatRoom.findByIdAndUpdate(chatroomid, {
          $set: { chatactive: false },
        });

        if (result) {
          return res.send({
            status: true,
            message: `Chat room Deactivated.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Chat room not Deactivated.`,
          });
        }
      } else {
        const result = await ChatRoom.findByIdAndUpdate(chatroomid, {
          $set: { chatactive: true },
        });

        if (result) {
          return res.send({
            status: true,
            message: `Chat room Activated.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Chat room not Activated.`,
          });
        }
      }
    } else {
      return res.send({
        status: false,
        message: `Chat room not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = { createChatRoom, changeStatus };
