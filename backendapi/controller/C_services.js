const mongoose = require("mongoose");
const Services = require("../models/M_services");
const {
  craeteServicesVal,
  editServicesVal,
} = require("../helper/joivalidation");
const { removeFile } = require("../helper/removefile");

// Create new services API.
const createServices = async (req, res, next) => {
  try {
    const { servicename } = req.body;

    if (req.file) {
      var serviceImage = req.file.filename;
      // Joi validation.
      const { error } = craeteServicesVal(req.body);

      if (error) {
        removeFile(serviceImage);
        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      } else {
        var createServices = new Services({
          servicename: servicename,
          serviceimage: serviceImage,
        });

        const insertQry = await createServices.save();

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
    } else {
      if (req.file) removeFile(serviceImage);
      return res.send({
        status: false,
        message: `Service image is required`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    removeFile(serviceImage);
    next(error);
  }
};

// Gel all services API.
const getAllServices = async (req, res, next) => {
  try {
    const getQry = await Services.find();

    if (getQry.length > 0) {
      return res.send({
        status: true,
        message: `${getQry.length} Service found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Service not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Gel single services API.
const getSingleServices = async (req, res, next) => {
  try {
    const servicesId = req.body.servicesid;

    if (mongoose.isValidObjectId(servicesId)) {
      const getQry = await Services.findById(servicesId);

      if (getQry) {
        return res.send({
          status: true,
          message: `Service found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          status: false,
          message: `Service not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete single services API.
const deleteServices = async (req, res, next) => {
  try {
    const servicesId = req.body.servicesid;

    if (!servicesId) {
      return res.send({
        status: false,
        message: `Service ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await Services.find({
        _id: {
          $in: servicesId,
        },
      });

      var totalServices = findQry.length;
      var cntServices = 0;

      if (totalServices <= 0) {
        return res.send({
          status: true,
          message: `${cntServices} services found into system.!`,
        });
      } else {
        // Array of all services.
        await Promise.all(
          findQry.map(async (allServices) => {
            cntServices = cntServices + 1;
            await Services.findByIdAndDelete(allServices._id);
            removeFile(allServices.serviceimage);
          })
        );

        if (totalServices == cntServices) {
          return res.send({
            status: true,
            message: `${cntServices} Services deleted.!`,
          });
        } else if (cntServices > 0) {
          return res.send({
            status: true,
            message: `Services deleted ${cntServices} out of ${totalServices} services.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalServices} services but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit services API.
const editServices = async (req, res, next) => {
  try {
    let data = {
      servicesid: req.body.servicesid,
      servicename: req.body.servicename,
    };

    if (req.file) {
      var serviceImage = req.file.filename;
    }

    if (!data.servicesid) {
      removeFile(serviceImage);

      return res.send({
        status: false,
        message: `Service ID is not allowed to be empty.`,
      });
    } else {
      // Joi validation.
      let { error } = editServicesVal(data);

      if (error) {
        removeFile(serviceImage);

        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      }
      let findQry = await Services.findById(data.servicesid);

      if (findQry) {
        servicename = data.servicename;

        var updateData = {
          servicename: data.servicename,
          serviceimage: serviceImage,
        };

        let updateQry = await Services.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          if (req.file) {
            removeFile(findQry.serviceimage);
          }

          return res.send({
            status: true,
            message: `Service updated.!`,
          });
        } else {
          removeFile(serviceImage);
          return res.send({
            status: false,
            message: `Service not updated.!`,
          });
        }
      } else {
        removeFile(serviceImage);
        return res.send({
          status: false,
          message: `Service not found into system.!`,
        });
      }
    }
  } catch (error) {
    removeFile(serviceImage);
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createServices,
  getAllServices,
  getSingleServices,
  deleteServices,
  editServices,
};
