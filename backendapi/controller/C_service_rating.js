const ServiceRating = require("../models/M_service_rating");

const { getCusOwnedRateVal } = require("../helper/joivalidation");

// Create service orderrating API.
const createOrderRate = async (req, res, next) => {
  try {
    const { customerid, orderhistoryid, rate, description } = req.body;

    var orderRating = new ServiceRating({
      customerid: customerid,
      orderhistoryid: orderhistoryid,
      rate: rate,
      description: description,
    });

    const insertQry = await orderRating.save();

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
const deleteOrderRate = async (req, res, next) => {
  try {
    const orderRateId = req.body.orderrateid;

    if (!orderRateId) {
      return res.send({
        status: false,
        message: `Service rating Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await ServiceRating.find({
        _id: {
          $in: orderRateId,
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
      });

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
    console.log(serviceProviderId, "serviceProviderId");

    const findQry = await ServiceRating.find().populate({
      path: "orderhistoryid",
      match: { serviceproviderid: serviceProviderId },
      select: "customerid serviceproviderid",
    });

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

module.exports = {
  createOrderRate,
  deleteOrderRate,
  getCusOwnedRate,
  getServiceRate,
};
