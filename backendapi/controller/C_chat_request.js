var moment = require("moment");
const ChatRequest = require("../models/M_chat_request");

const { chatReqStatusVal } = require("../helper/joivalidation");

// Create chat request API.
const createChatReq = async (req, res, next) => {
  try {
    const { customerid, serviceprovid } = req.body;

    const getQry1 = await ChatRequest.findOne().where({
      customerid: customerid,
      serviceprovid: serviceprovid,
    });

    const getQry2 = await ChatRequest.findOne().where({
      customerid: serviceprovid,
      serviceprovid: customerid,
    });

    let findData = getQry1 ? getQry1 : getQry2;

    if (!findData) {
      var chatRequest = new ChatRequest({
        customerid: customerid,
        serviceprovid: serviceprovid,
      });

      const insertQry = await chatRequest.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Chat request created.`,
          data: insertQry,
        });
      } else {
        return res.send({
          status: false,
          message: `Chat request not created.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Check chat status accept or reject API.
const checkStatus = async (req, res, next) => {
  try {
    let chatRequestId = req.body.chatrequestid;
    // let chatRequestId = requestId;
    if (chatRequestId) {
      let findStatus = await ChatRequest.findById(chatRequestId).select(
        "chatstatus"
      );

      if (findStatus) {
        return res.send({
          status: true,
          message: `Chat request find.`,
          data: findStatus,
        });
      } else {
        return res.send({
          status: false,
          message: `Chat request not find.`,
        });
      }
    } else {
      // console.log("Chat request Id is required");
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Change chat request status API.
const changeStatus = async (req, res, next) => {
  try {
    let data = {
      chatrequestid: req.body.chatrequestid,
      chatstatus: req.body.chatstatus,
    };

    // Joi validation.
    let { error } = chatReqStatusVal(data);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      const getQry = await ChatRequest.findById(data.chatrequestid);

      if (getQry) {
        if (getQry) {
          const result = await ChatRequest.findByIdAndUpdate(getQry._id, {
            $set: { chatstatus: data.chatstatus },
          });

          if (result) {
            return res.send({
              status: true,
              message: `Chat request status changed.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Chat request status not changed.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `Chat request not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all chat Request based on service provider Id API.
const getAllChatRequest = async (req, res, next) => {
  try {
    let serviceprovid = req.userid;

    let getQry = await ChatRequest.find()
      .where({
        serviceprovid: serviceprovid,
      })
      .populate({ path: "customerid", select: "name" })
      .populate({ path: "serviceprovid", select: "name image" });

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
const getAllCusChatRequest = async (req, res, next) => {
  try {
    const { customerid } = req.body;
    console.log(customerid, "customerid");

    let getQry = await ChatRequest.find()
      .where({
        customerid: customerid,
      })
      .populate({ path: "customerid", select: "name" })
      .populate({ path: "serviceprovid", select: "name image" });

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

module.exports = {
  createChatReq,
  checkStatus,
  changeStatus,
  getAllChatRequest,
  getAllCusChatRequest,
};
