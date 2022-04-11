const mongoose = require("mongoose");
const ServiceHistory = require("../models/M_service_history");

const {
  createServiceHisVal,
  editServiceHisVal,
  changeServiceStatusVal,
} = require("../helper/joivalidation");

// Create new service history API.
const createServicehistory = async (req, res, next) => {
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
    const { error } = createServiceHisVal(data);

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

      let createOrderHistory = new ServiceHistory({
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

// Get all service history API.
const getAllServicehistory = async (req, res, next) => {
  try {
    const getQry = await ServiceHistory.find();

    if (getQry.length > 0) {
      return res.send({
        status: true,
        message: `${getQry.length} service history found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} service history not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get single service history API.
const getSingleServicehistory = async (req, res, next) => {
  try {
    const orderHistoryId = req.body.orderhistoryid;

    if (mongoose.isValidObjectId(orderHistoryId)) {
      const getQry = await ServiceHistory.findById(orderHistoryId);

      if (getQry) {
        return res.send({
          status: true,
          message: `Service history found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          status: false,
          message: `Service history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service history ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete single service history API.
const deleteServicehistory = async (req, res, next) => {
  try {
    const orderHistoryId = req.body.orderhistoryid;

    if (!orderHistoryId) {
      return res.send({
        status: false,
        message: `Service history ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await ServiceHistory.find({
        _id: {
          $in: orderHistoryId,
        },
      });

      var totalServices = findQry.length;
      var cntServices = 0;

      if (totalServices <= 0) {
        return res.send({
          status: true,
          message: `${cntServices} Service history found into system.!`,
        });
      } else {
        // Array of all order history.
        await Promise.all(
          findQry.map(async (allServices) => {
            cntServices = cntServices + 1;
            await ServiceHistory.findByIdAndDelete(allServices._id);
          })
        );

        if (totalServices == cntServices) {
          return res.send({
            status: true,
            message: `${cntServices} Service history deleted.!`,
          });
        } else if (cntServices > 0) {
          return res.send({
            status: true,
            message: `Service history deleted ${cntServices} out of ${totalServices} service history.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalServices} service history but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit service history API.
const editServicehistory = async (req, res, next) => {
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
        message: `Service history ID is not allowed to be empty.`,
      });
    } else {
      // Joi validation.
      let { error } = editServiceHisVal(data);

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
      let findQry = await ServiceHistory.findById(data.orderhistoryid);

      if (findQry) {
        var updateData = {
          serviceproviderid: data.serviceproviderid,
          addresstype: data.addresstype,
          address: address,
          name: data.name,
          orderdate: data.orderdate,
          ordertime: ordertime,
        };

        let updateQry = await ServiceHistory.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          return res.send({
            status: true,
            message: `Service history updated.!`,
          });
        } else {
          return res.send({
            status: false,
            message: `Service history not updated.!`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Service history not found into system.!`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// get service history based on service provider ID API.
const getServiceSerProvider = async (req, res, next) => {
  try {
    let serProviderId = req.body.serproviderid;
    serProviderId = mongoose.Types.ObjectId(serProviderId);
    // console.log(serProviderId);

    if (mongoose.isValidObjectId(serProviderId)) {
      const getQry = await ServiceHistory.find(serProviderId);

      if (getQry) {
        return res.send({
          status: true,
          message: `Service history found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          status: false,
          message: `Service history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service history ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Change service status BY Service Provider API.
const changeServiceStatus = async (req, res, next) => {
  try {
    let data = {
      orderhistoryid: req.body.orderhistoryid,
      orderstatus: req.body.orderstatus,
    };

    // Joi validation.
    let { error } = changeServiceStatusVal(data);

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
      const getQry = await ServiceHistory.findById(orderHistoryId);

      if (getQry) {
        if (req.body.orderstatus == "") {
          return res.send({
            status: false,
            message: `Service history status is required.`,
          });
        } else {
          let updateQry = await ServiceHistory.findByIdAndUpdate(orderHistoryId, {
            $set: { orderstatus: data.orderstatus },
          });
          if (updateQry) {
            return res.send({
              status: true,
              message: `Service history status changed.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Service history status  not updated.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `Service history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service history ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createServicehistory,
  getAllServicehistory,
  getSingleServicehistory,
  deleteServicehistory,
  editServicehistory,
  getServiceSerProvider,
  changeServiceStatus,
};
