var moment = require("moment");
const mongoose = require("mongoose");
const ServiceHistory = require("../models/M_service_history");
const Serviceprovider = require("../models/M_serviceprovider");
const Paymenthistory = require("../models/M_payment_history");

const {
  createServiceHisVal,
  editServiceHisVal,
  changeServiceStatusVal,
} = require("../helper/joivalidation");

// Create new service history API.
const createServiceHistory = async (req, res, next) => {
  try {
    let bookingdate = new Date();
    bookingdate = moment(bookingdate).format("DD MMM, hh:mm A");

    let data = {
      serviceproviderid: req.body.serviceproviderid,
      customerid: req.body.customerid,
      addresstype: req.body.addresstype,
      address: req.body.address,
      name: req.body.name,
      servicedate: req.body.servicedate,
      servicestatus: req.body.servicestatus,
      bookingdate: bookingdate,
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
      let createServiceHistory = new ServiceHistory({
        serviceproviderid: data.serviceproviderid,
        customerid: data.customerid,
        addresstype: data.addresstype,
        address: data.address,
        name: data.name,
        servicedate: data.servicedate,
        sessiontime: req.body.sessiontime,
        servicestatus: data.servicestatus,
        bookingdate: data.bookingdate,
      });

      const insertQry = await createServiceHistory.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Service booked.`,
          data: insertQry._id,
        });
      } else {
        return res.send({
          status: false,
          message: `Service not booked.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all service history API.
const getAllServiceHistory = async (req, res, next) => {
  try {
    let getQry = await ServiceHistory.find()
      .populate({
        path: "serviceproviderid",
        select: "name",
      })
      .populate({
        path: "customerid",
        select: "name",
      });

    let findData = [];
    if (getQry.length > 0) {
      await Promise.all(
        getQry.map(async (data) => {
          let resData = {};
          resData = data.toObject();

          delete resData.__v; // delete person["__v"]

          let findPaymentStatus = await Paymenthistory.findOne()
            .where({ servicehistoryid: resData._id })
            .select("paymentstatus");

          if (findPaymentStatus) {
            resData.paymentstatus = findPaymentStatus.paymentstatus;
          } else {
            resData.paymentstatus = false;
          }

          // Servicedate date convert into date and time (DD/MM/YYYY) format
          var serviceDate = resData.servicedate.toISOString().slice(0, 10);
          resData.servicedate = moment(serviceDate).format("DD-MM-YYYY");

          // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          createDate = resData.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          resData.createdAt = moment(createDate).format("DD-MM-YYYY HH:MM:SS");

          // updatedAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          updateDate = resData.updatedAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          resData.updatedAt = moment(updateDate).format("DD-MM-YYYY HH:MM:SS");

          findData.push(resData);
        })
      );

      return res.send({
        status: true,
        message: `${findData.length} service history found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${findData.length} service history not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get single service history API.
const getSingleServiceHistory = async (req, res, next) => {
  try {
    const serviceHistoryId = req.body.servicehistoryid;

    if (mongoose.isValidObjectId(serviceHistoryId)) {
      let getQry = await ServiceHistory.findById(serviceHistoryId);

      if (getQry) {
        let resData = {};
        resData = getQry.toObject();

        delete resData.updatedAt; // delete person["updatedAt"]
        delete resData.__v; // delete person["__v"]

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

        // Servicedate date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
        var serviceDate = resData.servicedate
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");
        resData.servicedate = moment(serviceDate).format("DD-MM-YYYY HH:MM:SS");

        // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
        createDate = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.createdAt = moment(createDate).format("DD-MM-YYYY HH:MM:SS");

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
const deleteServiceHistory = async (req, res, next) => {
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
const editServiceHistory = async (req, res, next) => {
  try {
    let data = {
      servicehistoryid: req.body.servicehistoryid,
      serviceproviderid: req.body.serviceproviderid,
      addresstype: req.body.addresstype,
      address: req.body.address,
      name: req.body.name,
      servicedate: req.body.servicedate,
      // sessiontime: req.body.sessiontime,
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
          address: data.address,
          name: data.name,
          servicedate: data.servicedate,
          sessiontime: req.body.sessiontime,
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

    if (mongoose.isValidObjectId(serProviderId)) {
      const getQry = await ServiceHistory.find().where({
        serviceproviderid: serProviderId,
      });

      if (getQry.length > 0) {
        let findData = [];
        getQry.map((data) => {
          let resData = {};
          resData = data.toObject();

          delete resData.__v; // delete person["__v"]

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

          // Servicedate date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          var serviceDate = resData.servicedate
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");
          resData.servicedate = moment(serviceDate).format(
            "DD-MM-YYYY HH:MM:SS"
          );

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
        let bookingdate = new Date();
        bookingdate = moment(bookingdate).format("DD MMM, hh:mm A");

        let updateQry = await ServiceHistory.findByIdAndUpdate(
          serviceHistoryId,
          {
            $set: {
              servicestatus: data.servicestatus,
              bookingdate: bookingdate,
            },
          }
        );

        if (updateQry) {
          return res.send({
            status: true,
            message: `Service history status changed`,
          });
        } else {
          return res.send({
            status: false,
            message: `Service history status  not updated.`,
          });
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
        getQry.map((data) => {
          let resData = {};
          resData = data.toObject();

          delete resData.updatedAt; // delete person["updatedAt"]
          delete resData.__v; // delete person["__v"]

          // Set address type.
          if (resData.addresstype == 1) {
            resData.addresstype = "Office";
          } else if (resData.addresstype == 2) {
            resData.addresstype = "Home";
          }

          // Set payment status.
          if (resData.paymentstatus) {
            resData.paymentstatus = "Completed";
          } else {
            resData.paymentstatus = "Pending";
          }

          // Servicedate date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          var serviceDate = resData.servicedate
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");
          resData.servicedate = moment(serviceDate).format(
            "DD-MM-YYYY HH:MM:SS"
          );

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

// get service status based on service history ID API.
const getServiceStatus = async (req, res, next) => {
  try {
    let serviceHistoryId = req.body.servicehistoryid;
    if (!serviceHistoryId) {
      return res.send({
        status: false,
        message: `Customer service Id is required.`,
      });
    } else {
      serviceHistoryId = mongoose.Types.ObjectId(serviceHistoryId);

      if (mongoose.isValidObjectId(serviceHistoryId)) {
        let getQry = await ServiceHistory.findById(serviceHistoryId).select(
          "serviceproviderid servicestatus bookingdate"
        );
        if (getQry == null) {
          return res.send({
            status: false,
            message: `Customer service status not found into system.`,
          });
        } else {
          if (getQry) {
            let resData = {};
            resData = getQry.toObject();

            let findProfile = await Serviceprovider.findOne({
              _id: resData.serviceproviderid,
            }).populate({ path: "userid", select: "name mobilenumber" });

            let objectData = [];
            for (let index = 0; index <= 3; index++) {
              if (index == 0) {
                var title = "Booking request sent";
              } else if (index == 1) {
                var title = "Accepted";
              } else if (index == 2) {
                var title = "Job started";
              } else if (index == 3) {
                var title = "Job completed";
              }
              // else if (index == 4) {
              //   var title = "Reject";
              // }

              let newObject = {
                _id: resData._id,
                servicestatus: false,
                title: title,
                bookingdate: resData.bookingdate,
              };
              if (index <= resData.servicestatus) {
                newObject = { ...newObject, servicestatus: true };
              }
              objectData.push(newObject);
            }

            return res.send({
              status: true,
              message: `Customer service status found into system.`,
              serviceproviderdetails: findProfile.userid,
              data: objectData,
            });
          } else {
            return res.send({
              status: false,
              message: `Customer service status not found into system.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `Customer service status not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// get payment status based on service history ID API.
const getPaymentStatus = async (req, res, next) => {
  try {
    let serviceHistoryId = req.body.servicehistoryid;
    if (!serviceHistoryId) {
      return res.send({
        status: false,
        message: `Payment Id is required.`,
      });
    } else {
      serviceHistoryId = mongoose.Types.ObjectId(serviceHistoryId);

      if (mongoose.isValidObjectId(serviceHistoryId)) {
        let getQry = await ServiceHistory.findById(serviceHistoryId).select(
          "paymentstatus"
        );

        if (getQry == null) {
          return res.send({
            status: false,
            message: `Payment status not found into system.`,
          });
        } else {
          if (getQry) {
            let resData = {};
            resData = getQry.toObject();

            delete resData.updatedAt; // delete person["updatedAt"]
            delete resData.__v; // delete person["__v"]

            // Set payment status.
            if (resData.paymentstatus) {
              resData.paymentstatus = "Completed";
            } else {
              resData.paymentstatus = "Pending";
            }

            return res.send({
              status: true,
              message: `Payment status found into system.`,
              data: resData,
            });
          } else {
            return res.send({
              status: false,
              message: `Payment status not found into system.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `${serviceHistoryId} Id is not valid. Please enter valid ID`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Count serivice provider job API.
const countJob = async (req, res, next) => {
  try {
    let serviceProviderId = req.body.serviceproviderid;

    if (!serviceProviderId) {
      return res.send({
        status: false,
        message: `Payment Id is required.`,
      });
    } else {
      serviceProviderId = new mongoose.Types.ObjectId(serviceProviderId);

      if (mongoose.isValidObjectId(serviceProviderId)) {
        let getQry = await ServiceHistory.find()
          .where({ serviceproviderid: serviceProviderId })
          .count();

        if (getQry > 0 && getQry > -1) {
          return res.send({
            status: true,
            message: `Job count.`,
            count: getQry,
          });
        } else {
          return res.send({
            status: true,
            message: `Job count.`,
            count: 0,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `${serviceProviderId} Id is not valid. Please enter valid ID`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get service history based on service provider TOKEN API.
const getSerProHistoty = async (req, res, next) => {
  try {
    let serProviderId = new mongoose.Types.ObjectId(req.userid);
    if (serProviderId) {
      let findServiceProvider = await Serviceprovider.find({
        userid: serProviderId,
      }).select("_id");

      let finalResult = [];
      await Promise.all(
        findServiceProvider.map(async (item) => {
          let getQry = await ServiceHistory.find()
            .populate({
              path: "serviceproviderid",
            })
            .populate({
              path: "customerid",
              select: "name",
            })
            .where({ serviceproviderid: item._id });

          finalResult = [...finalResult, ...getQry];
        })
      );

      let findData = [];
      if (finalResult.length > 0) {
        await Promise.all(
          finalResult.map(async (data) => {
            let resData = {};
            resData = data.toObject();

            let findPaymentStatus = await Paymenthistory.findOne()
              .where({ servicehistoryid: resData._id })
              .select("paymentstatus");

            if (findPaymentStatus) {
              resData.paymentstatus = findPaymentStatus.paymentstatus;
            } else {
              resData.paymentstatus = false;
            }

            // Servicedate date convert into date and time (DD/MM/YYYY) format
            let serviceDate = new Date(resData.servicedate);
            resData.servicedate = moment(serviceDate).format("DD-MM-YYYY");

            // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
            let createDate = new Date(resData.createdAt);
            // createDate = createDate
            //     .toISOString()
            //     .replace(/T/, " ")
            //     .replace(/\..+/, "");

            resData.createdAt = moment(createDate).format(
              "DD-MM-YYYY HH:MM:SS"
            );

            // updatedAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
            let updateDate = new Date(resData.updatedAt);
            // updateDate = updateDate
            //     .toISOString()
            //     .replace(/T/, " ")
            //     .replace(/\..+/, "");

            resData.updatedAt = moment(updateDate).format(
              "DD-MM-YYYY HH:MM:SS"
            );

            delete resData.__v; // delete person["__v"]

            findData.push(resData);
          })
        );

        if (findData.length > 0) {
          return res.send({
            status: true,
            message: `${findData.length} Service history found into system.`,
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
          message: `Service history not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `ID is required.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get upcoming customer history API.
const Upcoming = async (req, res, next) => {
  try {
    let customerId = req.body.customerid;
    customerId = mongoose.Types.ObjectId(customerId);

    if (mongoose.isValidObjectId(customerId)) {
      let getQry = await ServiceHistory.find({})
        .select("servicedate sessiontime")
        .where({
          customerid: customerId,
          servicestatus: { $in: [0, 1, 2] },
        })
        .populate({
          path: "serviceproviderid",
          select: "name",
          populate: {
            path: "subserviceid",
            select: "subservicename",
          },
        });

      let findData = [];
      if (getQry.length > 0) {
        await Promise.all(
          getQry.map(async (data) => {
            let resData = {};
            resData = data.toObject();

            let findPaymentStatus = await Paymenthistory.findOne()
              .where({ servicehistoryid: resData._id })
              .select("paymentstatus");
            // console.log(findPaymentStatus, "findPaymentStatus");
            if (findPaymentStatus) {
              if (findPaymentStatus.paymentstatus) {
                // Servicedate date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
                var serviceDate = resData.servicedate
                  .toISOString()
                  .replace(/T/, " ")
                  .replace(/\..+/, "");

                resData.servicedate = moment(serviceDate).format("MMM-DD-YYYY");
                findData.push(resData);
              }
            }
          })
        );

        return res.send({
          status: true,
          message: `${findData.length} customer service history found into system.`,
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

// Get History customer history API.
const History = async (req, res, next) => {
  try {
    let customerId = req.body.customerid;
    customerId = mongoose.Types.ObjectId(customerId);

    if (mongoose.isValidObjectId(customerId)) {
      let getQry = await ServiceHistory.find({})
        .select("servicedate sessiontime")
        .where({
          customerid: customerId,
          servicestatus: { $in: [3] },
        })
        .populate({
          path: "serviceproviderid",
          select: "name",
          populate: {
            path: "subserviceid",
            select: "subservicename",
          },
        });

      let findData = [];
      if (getQry.length > 0) {
        getQry.map((data) => {
          let resData = {};
          resData = data.toObject();

          // Servicedate date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          var serviceDate = resData.servicedate
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          resData.servicedate = moment(serviceDate).format("MMM-DD-YYYY");

          findData.push(resData);
        });

        return res.send({
          status: true,
          message: `${findData.length} customer service history found into system.`,
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
  createServiceHistory,
  getAllServiceHistory,
  getSingleServiceHistory,
  deleteServiceHistory,
  editServiceHistory,
  getServiceSerProvider,
  changeServiceStatus,
  customerBookService,
  getServiceStatus,
  getPaymentStatus,
  countJob,
  getSerProHistoty,
  Upcoming,
  History,
};
