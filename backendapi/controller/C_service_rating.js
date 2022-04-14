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

    var serviceRating = new ServiceRating({
      customerid: customerid,
      serviceproviderid: serviceproviderid,
      servicehistoryid: servicehistoryid,
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

// Get service based rating API.
const getServiceRate = async (req, res, next) => {
  try {
    const serviceProviderId = req.body.serviceproviderid;
    // console.log(serviceProviderId, "serviceProviderId");

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

    let averageRate = 0;
    let totalCnt = countRate.length;

    countRate.forEach((rate) => {
      averageRate = averageRate + rate.rate;
    });

    averageRate = averageRate / totalCnt;

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
};
