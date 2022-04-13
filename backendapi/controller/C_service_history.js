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
      servicedate: req.body.servicedate,
      sessiontype: req.body.sessiontype,
      sessiontime: req.body.sessiontime,
      servicestatus: req.body.servicestatus,
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

      let servicetime = {
        sessiontype: data.sessiontype,
        sessiontime: data.sessiontime,
      };

      let createServiceHistory = new ServiceHistory({
        serviceproviderid: data.serviceproviderid,
        customerid: data.customerid,
        addresstype: data.addresstype,
        address: address,
        name: data.name,
        servicedate: data.servicedate,
        servicetime: servicetime,
        servicestatus: data.servicestatus,
      });

      const insertQry = await createServiceHistory.save();

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
    let getQry = await ServiceHistory.find();

    if (getQry.length > 0) {
      let findData = [];
      let resData = {};
      getQry.forEach((data) => {
        resData = data.toObject();

        delete resData.updatedAt; // delete person["updatedAt"]
        delete resData.__v; // delete person["__v"]

        // Set time morning or afternoon.
        if (resData.servicetime.sessiontype == 1) {
          resData.servicetime.sessiontype = "Morning";
        } else if (resData.servicetime.sessiontype == 2) {
          resData.servicetime.sessiontype = "Afternoon";
        }

        // Set address type.
        if (resData.addresstype == 1) {
          resData.addresstype = "Office";
        } else if (resData.addresstype == 2) {
          resData.addresstype = "Home";
        }

        // Set service status.
        if (resData.servicestatus == 0) {
          resData.servicestatus = "Booking_request_sent";
        } else if (resData.servicestatus == 1) {
          resData.servicestatus = "accept";
        } else if (resData.servicestatus == 2) {
          resData.servicestatus = "Booking_confirmed";
        } else if (resData.servicestatus == 3) {
          resData.servicestatus = "Job_started";
        } else if (resData.servicestatus == 4) {
          resData.servicestatus = "Job_Completed";
        } else if (resData.servicestatus == 5) {
          resData.servicestatus = "Reject";
        }

        // Set payment status.
        if (resData.paymentstatus) {
          resData.paymentstatus = "Completed";
        } else {
          resData.paymentstatus = "Pending";
        }

        // Servicedate date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.servicedate = resData.servicedate
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        findData.push(resData);
      });

      return res.send({
        status: true,
        message: `${getQry.length} service history found into system.`,
        data: findData,
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
    const serviceHistoryId = req.body.servicehistoryid;

    if (mongoose.isValidObjectId(serviceHistoryId)) {
      let getQry = await ServiceHistory.findById(serviceHistoryId);

      if (getQry) {
        let resData = {};
        resData = getQry.toObject();

        delete resData.updatedAt; // delete person["updatedAt"]
        delete resData.__v; // delete person["__v"]

        // Set time morning or afternoon.
        if (resData.servicetime.sessiontype == 1) {
          resData.servicetime.sessiontype = "Morning";
        } else if (resData.servicetime.sessiontype == 2) {
          resData.servicetime.sessiontype = "Afternoon";
        }

        // Set address type.
        if (resData.addresstype == 1) {
          resData.addresstype = "Office";
        } else if (resData.addresstype == 2) {
          resData.addresstype = "Home";
        }

        // Set service status.
        if (resData.servicestatus == 0) {
          resData.servicestatus = "Booking_request_sent";
        } else if (resData.servicestatus == 1) {
          resData.servicestatus = "accept";
        } else if (resData.servicestatus == 2) {
          resData.servicestatus = "Booking_confirmed";
        } else if (resData.servicestatus == 3) {
          resData.servicestatus = "Job_started";
        } else if (resData.servicestatus == 4) {
          resData.servicestatus = "Job_Completed";
        } else if (resData.servicestatus == 5) {
          resData.servicestatus = "Reject";
        }

        // Set payment status.
        if (resData.paymentstatus) {
          resData.paymentstatus = "Completed";
        } else {
          resData.paymentstatus = "Pending";
        }

        // servicedate date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.servicedate = resData.servicedate
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        return res.send({
          status: true,
          message: `Service history found into system.`,
          data: resData,
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
    const serviceHistoryId = req.body.servicehistoryid;

    if (!serviceHistoryId) {
      return res.send({
        status: false,
        message: `Service history ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await ServiceHistory.find({
        _id: {
          $in: serviceHistoryId,
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
        // Array of all service history.
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
      servicehistoryid: req.body.servicehistoryid,
      serviceproviderid: req.body.serviceproviderid,
      addresstype: req.body.addresstype,
      street: req.body.street,
      area: req.body.area,
      pincode: req.body.pincode,
      name: req.body.name,
      servicedate: req.body.servicedate,
      sessiontype: req.body.sessiontype,
      sessiontime: req.body.sessiontime,
    };

    let address = {
      street: data.street,
      area: data.area,
      pincode: data.pincode,
    };

    let servicetime = {
      sessiontype: data.sessiontype,
      sessiontime: data.sessiontime,
    };

    if (!data.servicehistoryid) {
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
      let findQry = await ServiceHistory.findById(data.servicehistoryid);

      if (findQry) {
        var updateData = {
          serviceproviderid: data.serviceproviderid,
          addresstype: data.addresstype,
          address: address,
          name: data.name,
          servicedate: data.servicedate,
          servicetime: servicetime,
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

      if (getQry.length > 0) {
        let findData = [];
        let resData = {};
        getQry.forEach((data) => {
          resData = data.toObject();

          delete resData.updatedAt; // delete person["updatedAt"]
          delete resData.__v; // delete person["__v"]

          // Set time morning or afternoon.
          if (resData.servicetime.sessiontype == 1) {
            resData.servicetime.sessiontype = "Morning";
          } else if (resData.servicetime.sessiontype == 2) {
            resData.servicetime.sessiontype = "Afternoon";
          }

          // Set address type.
          if (resData.addresstype == 1) {
            resData.addresstype = "Office";
          } else if (resData.addresstype == 2) {
            resData.addresstype = "Home";
          }

          // Set service status.
          if (resData.servicestatus == 0) {
            resData.servicestatus = "Booking_request_sent";
          } else if (resData.servicestatus == 1) {
            resData.servicestatus = "accept";
          } else if (resData.servicestatus == 2) {
            resData.servicestatus = "Booking_confirmed";
          } else if (resData.servicestatus == 3) {
            resData.servicestatus = "Job_started";
          } else if (resData.servicestatus == 4) {
            resData.servicestatus = "Job_Completed";
          } else if (resData.servicestatus == 5) {
            resData.servicestatus = "Reject";
          }

          // Set payment status.
          if (resData.paymentstatus) {
            resData.paymentstatus = "Completed";
          } else {
            resData.paymentstatus = "Pending";
          }

          // Servicedate date convert into date and time (DD/MM/YYYY HH:MM:SS) format
          resData.servicedate = resData.servicedate
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
          resData.createdAt = resData.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          findData.push(resData);
        });

        return res.send({
          status: true,
          message: `Service history found into system.`,
          data: findData,
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
      servicehistoryid: req.body.servicehistoryid,
      servicestatus: req.body.servicestatus,
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

    let serviceHistoryId = mongoose.Types.ObjectId(data.servicehistoryid);

    if (mongoose.isValidObjectId(serviceHistoryId)) {
      const getQry = await ServiceHistory.findById(serviceHistoryId);

      if (getQry) {
        if (req.body.servicestatus == "") {
          return res.send({
            status: false,
            message: `Service history status is required.`,
          });
        } else {
          let updateQry = await ServiceHistory.findByIdAndUpdate(
            serviceHistoryId,
            {
              $set: { servicestatus: data.servicestatus },
            }
          );
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

// get customer book service based on customer ID API.
const customerBookService = async (req, res, next) => {
  try {
    let customerId = req.body.customerid;
    customerId = mongoose.Types.ObjectId(customerId);

    if (mongoose.isValidObjectId(customerId)) {
      let getQry = await ServiceHistory.find().where({
        customerid: customerId,
      });

      if (getQry.length > 0) {
        let findData = [];
        let resData = {};
        getQry.forEach((data) => {
          resData = data.toObject();

          delete resData.updatedAt; // delete person["updatedAt"]
          delete resData.__v; // delete person["__v"]

          // Set time morning or afternoon.
          if (resData.servicetime.sessiontype == 1) {
            resData.servicetime.sessiontype = "Morning";
          } else if (resData.servicetime.sessiontype == 2) {
            resData.servicetime.sessiontype = "Afternoon";
          }

          // Set address type.
          if (resData.addresstype == 1) {
            resData.addresstype = "Office";
          } else if (resData.addresstype == 2) {
            resData.addresstype = "Home";
          }

          // Set service status.
          if (resData.servicestatus == 0) {
            resData.servicestatus = "Booking_request_sent";
          } else if (resData.servicestatus == 1) {
            resData.servicestatus = "accept";
          } else if (resData.servicestatus == 2) {
            resData.servicestatus = "Booking_confirmed";
          } else if (resData.servicestatus == 3) {
            resData.servicestatus = "Job_started";
          } else if (resData.servicestatus == 4) {
            resData.servicestatus = "Job_Completed";
          } else if (resData.servicestatus == 5) {
            resData.servicestatus = "Reject";
          }

          // Set payment status.
          if (resData.paymentstatus) {
            resData.paymentstatus = "Completed";
          } else {
            resData.paymentstatus = "Pending";
          }

          // Servicedate date convert into date and time (DD/MM/YYYY HH:MM:SS) format
          resData.servicedate = resData.servicedate
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
          resData.createdAt = resData.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          findData.push(resData);
        });

        return res.send({
          status: true,
          message: `Customer service history found into system.`,
          data: findData,
        });
      } else {
        return res.send({
          status: false,
          message: `Customer service history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Customer service history ID is not valid.`,
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
  customerBookService,
};
