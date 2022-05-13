var moment = require("moment");
const ServiceRating = require("../models/M_service_rating");

const { getCusOwnedRateVal } = require("../helper/joivalidation");

// Create service servicerating API.
const createServiceRate = async (req, res, next) => {
  try {
    const {
      customerid,
      serviceproviderid,
      servicehistoryid,
      rate,
      description,
    } = req.body;

    const findRating = await ServiceRating.find().where({
      servicehistoryid: servicehistoryid,
    });

    if (findRating.length > 0) {
      return res.send({
        status: true,
        message: `Have you already done service rating.`,
      });
    } else {
      var serviceRating = new ServiceRating({
        customerid: customerid,
        servicehistoryid: servicehistoryid,
        serviceproviderid: serviceproviderid,
        rate: rate,
        description: description,
      });

      const insertQry = await serviceRating.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Service rating created.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Service rating not created.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete service orderrating API.
const deleteServiceRate = async (req, res, next) => {
  try {
    const serviceRateId = req.body.servicerateid;

    if (!serviceRateId) {
      return res.send({
        status: false,
        message: `Service rating Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await ServiceRating.find({
        _id: {
          $in: serviceRateId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} Service rating found into system.!`,
        });
      } else {
        // Array of all service orderrating.
        Promise.all([
          findQry.map(async (allCustSup) => {
            count = count + 1;
            await ServiceRating.findByIdAndDelete(allCustSup._id);
          }),
        ]);

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} Service rating deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `Service rating deleted ${count} out of ${totalCount} service rating!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} service rating but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get customer owned service orderrating API.
const getCusOwnedRate = async (req, res, next) => {
  try {
    const data = { customerid: req.body.customerid };

    // Joi validation.
    let { error } = getCusOwnedRateVal(data);

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
      const findQry = await ServiceRating.find({
        customerid: data.customerid,
      })
        .select("rate description")
        .populate({ path: "serviceproviderid", select: "name" });

      // console.log(findQry, "findQry");

      if (findQry.length > 0) {
        return res.send({
          status: true,
          message: `${findQry.length} Customer owned service rating found into system.`,
          data: findQry,
        });
      } else {
        return res.send({
          status: false,
          message: `${findQry.length} Customer owned service rating not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get service based rating based on service provider Id API.
const getServiceRate = async (req, res, next) => {
  try {
    const serviceProviderId = req.body.serviceproviderid;

    const findQry = await ServiceRating.find()
      .where({
        serviceproviderid: serviceProviderId,
      })
      .select("rate description")
      .populate({ path: "customerid", select: "name" });

    if (findQry.length > 0) {
      return res.send({
        status: true,
        message: `${findQry.length} Service based rating found into system.`,
        data: findQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${findQry.length} Service based rating not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Count service provider rate count and average find API.
const countRate = async (req, res, next) => {
  try {
    const serviceProviderId = req.body.serviceproviderid;

    const countRate = await ServiceRating.find()
      .where({
        serviceproviderid: serviceProviderId,
      })
      .select("rate");

    if (countRate.length > 0) {
      let averageRate = 0;
      let totalCnt = countRate.length;

      countRate.forEach((rate) => {
        averageRate = averageRate + rate.rate;
      });

      averageRate = averageRate / totalCnt;

      console.log(averageRate, "averageRate");

      if (countRate > 0 && countRate > -1) {
        return res.send({
          status: true,
          message: `Service provider rate found into system.`,
          countrate: countRate.length,
          averagerate: averageRate,
        });
      } else {
        return res.send({
          status: false,
          message: `Service provider rate not found into system.`,
          countrate: countRate.length,
          averagerate: averageRate,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service provider rate not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all service rating API.
const getAll = async (req, res, next) => {
  try {
    const findQry = await ServiceRating.find()
      .populate({
        path: "customerid",
        select: "name",
      })
      .populate({
        path: "serviceproviderid",
        select: "name",
      });

    let findData = [];
    if (findQry.length > 0) {
      let resData = {};
      findQry.forEach((data) => {
        resData = data.toObject();

        delete resData.__v; // delete person["__v"]

        // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        createDate = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH");

        // updatedAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        updateDate = resData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.updatedAt = moment(updateDate).format("DD-MM-YYYY SS:MM:HH");

        findData.push(resData);
      });

      return res.send({
        status: true,
        message: `${findData.length} service rating found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `Service rating not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get service based rating based on TOKEN API.
const getServiceRating = async (req, res, next) => {
  try {
    const serviceProviderId = req.userid;

    const findQry = await ServiceRating.find()
      .where({
        serviceproviderid: serviceProviderId,
      })
      .select("rate description createdAt updatedAt")
      .populate({
        path: "customerid",
        select: "name",
      })
      .populate({
        path: "serviceproviderid",
        select: "name",
      });

    let findData = [];
    if (findQry.length > 0) {
      let resData = {};
      findQry.forEach((data) => {
        resData = data.toObject();

        delete resData.__v; // delete person["__v"]

        // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        createDate = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH");

        // updatedAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        updateDate = resData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.updatedAt = moment(updateDate).format("DD-MM-YYYY SS:MM:HH");

        findData.push(resData);
      });

      return res.send({
        status: true,
        message: `Service rating found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${findQry.length} Service based rating not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createServiceRate,
  deleteServiceRate,
  getCusOwnedRate,
  getServiceRate,
  countRate,
  getAll,
  getServiceRating,
};
