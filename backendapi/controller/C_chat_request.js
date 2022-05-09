var moment = require("moment");
const ChatRequest = require("../models/M_chat_request");

const { chatReqStatusVal } = require("../helper/joivalidation");

// Create chat request API.
const createChatReq = async (req, res, next) => {
  try {
    const { customerid, serviceprovid } = req.body;

    const getQry = await ChatRequest.find().where({
      customerid: customerid,
      serviceprovid: serviceprovid,
    });

    if (getQry.length > 0) {
      return res.send({
        status: true,
        message: `Chat request is already created.`,
      });
    } else {
      var chatRequest = new ChatRequest({
        customerid: customerid,
        serviceprovid: serviceprovid,
      });

      const insertQry = await chatRequest.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Chat request created.`,
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
        if (data.chatstatus == 2 || data.chatstatus == 3) {
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
        } else {
          return res.send({
            status: false,
            message: `Chat request status is not valid.`,
          });
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
    const { serviceprovid } = req.body;

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

        resData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH")

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

        resData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH")

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
  changeStatus,
  getAllChatRequest,
  getAllCusChatRequest,
};
