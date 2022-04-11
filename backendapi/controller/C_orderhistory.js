const mongoose = require("mongoose");
const Orderhistory = require("../models/M_orderhistory");

const {
  createOrderHisVal,
  editOrderHisVal,
  changeOrderStatusVal,
} = require("../helper/joivalidation");

// Create new order history API.
const createOrderhistory = async (req, res, next) => {
  try {
    let data = {
      serviceproviderid: req.body.serviceproviderid,
      customerid: req.body.customerid,
      addresstype: req.body.addresstype,
      street: req.body.street,
      area: req.body.area,
      pincode: req.body.pincode,
      name: req.body.name,
      orderdate: req.body.orderdate,
      sessiontype: req.body.sessiontype,
      sessiontime: req.body.sessiontime,
      orderstatus: req.body.orderstatus,
    };

    // Joi validation.
    const { error } = createOrderHisVal(data);

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
      let address = {
        street: data.street,
        area: data.area,
        pincode: data.pincode,
      };

      let ordertime = {
        sessiontype: data.sessiontype,
        sessiontime: data.sessiontime,
      };

      let createOrderHistory = new Orderhistory({
        serviceproviderid: data.serviceproviderid,
        customerid: data.customerid,
        addresstype: data.addresstype,
        address: address,
        name: data.name,
        orderdate: data.orderdate,
        ordertime: ordertime,
        orderstatus: data.orderstatus,
      });

      const insertQry = await createOrderHistory.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Service created.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Service not created.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all order history API.
const getAllOrderhistory = async (req, res, next) => {
  try {
    const getQry = await Orderhistory.find();

    if (getQry.length > 0) {
      return res.send({
        status: true,
        message: `${getQry.length} Order history found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Order history not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get single order history API.
const getSingleOrderhistory = async (req, res, next) => {
  try {
    const orderHistoryId = req.body.orderhistoryid;

    if (mongoose.isValidObjectId(orderHistoryId)) {
      const getQry = await Orderhistory.findById(orderHistoryId);

      if (getQry) {
        return res.send({
          status: true,
          message: `order history found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          status: false,
          message: `order history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `order history ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete single order history API.
const deleteOrderhistory = async (req, res, next) => {
  try {
    const orderHistoryId = req.body.orderhistoryid;

    if (!orderHistoryId) {
      return res.send({
        status: false,
        message: `Order history ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await Orderhistory.find({
        _id: {
          $in: orderHistoryId,
        },
      });

      var totalServices = findQry.length;
      var cntServices = 0;

      if (totalServices <= 0) {
        return res.send({
          status: true,
          message: `${cntServices} order history found into system.!`,
        });
      } else {
        // Array of all order history.
        await Promise.all(
          findQry.map(async (allServices) => {
            cntServices = cntServices + 1;
            await Orderhistory.findByIdAndDelete(allServices._id);
          })
        );

        if (totalServices == cntServices) {
          return res.send({
            status: true,
            message: `${cntServices} Order history deleted.!`,
          });
        } else if (cntServices > 0) {
          return res.send({
            status: true,
            message: `Order history deleted ${cntServices} out of ${totalServices} order history.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalServices} order history but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit order history API.
const editOrderhistory = async (req, res, next) => {
  try {
    let data = {
      orderhistoryid: req.body.orderhistoryid,
      serviceproviderid: req.body.serviceproviderid,
      addresstype: req.body.addresstype,
      street: req.body.street,
      area: req.body.area,
      pincode: req.body.pincode,
      name: req.body.name,
      orderdate: req.body.orderdate,
      sessiontype: req.body.sessiontype,
      sessiontime: req.body.sessiontime,
    };

    let address = {
      street: data.street,
      area: data.area,
      pincode: data.pincode,
    };

    let ordertime = {
      sessiontype: data.sessiontype,
      sessiontime: data.sessiontime,
    };

    if (!data.orderhistoryid) {
      return res.send({
        status: false,
        message: `Order history ID is not allowed to be empty.`,
      });
    } else {
      // Joi validation.
      let { error } = editOrderHisVal(data);

      if (error) {
        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      }
      let findQry = await Orderhistory.findById(data.orderhistoryid);

      if (findQry) {
        var updateData = {
          serviceproviderid: data.serviceproviderid,
          addresstype: data.addresstype,
          address: address,
          name: data.name,
          orderdate: data.orderdate,
          ordertime: ordertime,
        };

        let updateQry = await Orderhistory.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          return res.send({
            status: true,
            message: `Order history updated.!`,
          });
        } else {
          return res.send({
            status: false,
            message: `Order history not updated.!`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Order history not found into system.!`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// get order history based on service provider ID API.
const getOrderSerProvider = async (req, res, next) => {
  try {
    let serProviderId = req.body.serproviderid;
    serProviderId = mongoose.Types.ObjectId(serProviderId);
    // console.log(serProviderId);

    if (mongoose.isValidObjectId(serProviderId)) {
      const getQry = await Orderhistory.find(serProviderId);

      if (getQry) {
        return res.send({
          status: true,
          message: `order history found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          status: false,
          message: `order history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `order history ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Change order status BY Service Provider API.
const changeOrderStatus = async (req, res, next) => {
  try {
    let data = {
      orderhistoryid: req.body.orderhistoryid,
      orderstatus: req.body.orderstatus,
    };

    // Joi validation.
    let { error } = changeOrderStatusVal(data);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    }

    let orderHistoryId = mongoose.Types.ObjectId(data.orderhistoryid);

    if (mongoose.isValidObjectId(orderHistoryId)) {
      const getQry = await Orderhistory.findById(orderHistoryId);

      if (getQry) {
        if (req.body.orderstatus == "") {
          return res.send({
            status: false,
            message: `Order status is required.`,
          });
        } else {
          let updateQry = await Orderhistory.findByIdAndUpdate(orderHistoryId, {
            $set: { orderstatus: data.orderstatus },
          });
          if (updateQry) {
            return res.send({
              status: true,
              message: `Service order status changed.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Service order status  not updated.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `order history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `order history ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createOrderhistory,
  getAllOrderhistory,
  getSingleOrderhistory,
  deleteOrderhistory,
  editOrderhistory,
  getOrderSerProvider,
  changeOrderStatus,
};
