const mongoose = require("mongoose");
const Subservices = require("../models/M_subservices");
const Services = require("../models/M_services");

const {
  createSubServicesVal,
  editSubServicesVal,
} = require("../helper/joivalidation");

const { removeFile } = require("../helper/removefile");

// Create new sub services API.
const createSubServices = async (req, res, next) => {
  try {
    const { servicesid, subservicename } = req.body;

    if (req.file) {
      var subServiceImage = req.file.filename;

      // Joi validation.
      const { error } = createSubServicesVal(req.body);

      if (error) {
        removeFile(subServiceImage);
        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      } else {
        let findQry = await Services.findById(servicesid);

        if (findQry) {
          var createSubServices = new Subservices({
            servicesid: servicesid,
            subservicename: subservicename,
            subserviceimage: subServiceImage,
          });

          const insertQry = await createSubServices.save();

          if (insertQry) {
            return res.send({
              status: true,
              message: `Sub service created.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Sub service not created.`,
            });
          }
        } else {
          if (req.file) removeFile(subServiceImage);
          return res.send({
            status: false,
            message: `Service is not exist in system.`,
          });
        }
      }
    } else {
      if (req.file) removeFile(subServiceImage);
      return res.send({
        status: false,
        message: `Sub service image is required.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    removeFile(subServiceImage);
    next(error);
  }
};

// Gel all sub services API.
const getAllSubServices = async (req, res, next) => {
  try {
    const getQry = await Subservices.find().populate({
      path: "servicesid",
      select: "servicename serviceimage",
    });

    if (getQry.length > 0) {
      let findData = [];
      let resData = {};
      getQry.forEach((data) => {
        resData = data.toObject();

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        // updatedAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.updatedAt = resData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        delete resData.__v; // delete resData["__v"]

        findData.push(resData);
      });
      return res.send({
        status: true,
        message: `${findData.length} Sub service found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${findData.length} Sub service not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Gel all sub services based on service Id API.
const getSubServices = async (req, res, next) => {
  try {
    let servicesId = req.body.servicesid;

    if (mongoose.isValidObjectId(servicesId)) {
      const getQry = await Subservices.find()
        .where({
          servicesid: servicesId,
        })
        .populate({
          path: "servicesid",
          select: "servicename",
        });

      let findData = [];
      if (getQry.length > 0) {
        let resData = {};
        getQry.forEach((data) => {
          resData = data.toObject();

          // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
          resData.createdAt = resData.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          // updatedAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
          resData.updatedAt = resData.updatedAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          delete resData.__v; // delete resData["__v"]

          findData.push(resData);
        });
        return res.send({
          status: true,
          message: `${findData.length} Sub service found into system.`,
          data: findData,
        });
      } else {
        return res.send({
          status: false,
          message: `${findData.length} Sub service not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `${servicesId} service Id is not invalid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Gel single sub services API.
const getSingleSubServices = async (req, res, next) => {
  try {
    const subServicesId = req.body.subservicesid;

    if (mongoose.isValidObjectId(subServicesId)) {
      if (mongoose.isValidObjectId(subServicesId)) {
        const getQry = await Subservices.findById(subServicesId).populate({
          path: "servicesid",
          select: "servicename serviceimage",
        });

        if (getQry) {
          return res.send({
            status: true,
            message: `Sub service found into system.`,
            data: getQry,
          });
        } else {
          return res.send({
            status: false,
            message: `Sub service not found into system.`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Sub service ID is not valid.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `${subServicesId} sub service Id is not invalid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete single sub services API.
const deleteSubServices = async (req, res, next) => {
  try {
    const subServicesId = req.body.subservicesid;

    if (!subServicesId) {
      return res.send({
        status: false,
        message: `Sub services ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await Subservices.find({
        _id: {
          $in: subServicesId,
        },
      });

      var totalSubServices = findQry.length;
      var cntSubServices = 0;

      if (totalSubServices <= 0) {
        return res.send({
          status: true,
          message: `${cntSubServices} Sub services found into system.!`,
        });
      } else {
        // Array of all services.
        await Promise.all(
          findQry.map(async (allServices) => {
            cntSubServices = cntSubServices + 1;
            await Subservices.findByIdAndDelete(allServices._id);
            removeFile(allServices.subserviceimage);
          })
        );

        if (totalSubServices == cntSubServices) {
          return res.send({
            status: true,
            message: `${cntSubServices} Sub services deleted.!`,
          });
        } else if (cntSubServices > 0) {
          return res.send({
            status: true,
            message: `Sub services deleted ${cntSubServices} out of ${totalSubServices} sub services.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalSubServices} sub services but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit sub services API.
const editSubServices = async (req, res, next) => {
  try {
    let data = {
      subservicesid: req.body.subservicesid,
      servicesid: req.body.servicesid,
      subservicename: req.body.subservicename,
    };

    if (req.file) {
      var subServiceImage = req.file.filename;
    }

    if (!data.subservicesid) {
      removeFile(subServiceImage);

      return res.send({
        status: false,
        message: `Sub service ID is not allowed to be empty.`,
      });
    } else {
      // Joi validation.
      let { error } = editSubServicesVal(data);

      if (error) {
        removeFile(subServiceImage);

        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      }
      let findQry = await Subservices.findById(data.subservicesid);

      if (findQry) {
        let findServices = await Services.findById(data.servicesid);
        if (findServices) {
          var updateData = {
            servicesid: data.servicesid,
            subservicename: data.subservicename,
            subserviceimage: subServiceImage,
          };

          let updateQry = await Subservices.findByIdAndUpdate(findQry._id, {
            $set: updateData,
          });

          if (updateQry) {
            if (req.file) {
              removeFile(findQry.subserviceimage);
            }

            return res.send({
              status: true,
              message: `Sub service updated.!`,
            });
          } else {
            removeFile(subServiceImage);
            return res.send({
              status: false,
              message: `Sub service not updated.!`,
            });
          }
        } else {
          removeFile(subServiceImage);
          return res.send({
            status: false,
            message: `Service not found into system.!`,
          });
        }
      } else {
        removeFile(subServiceImage);
        return res.send({
          status: false,
          message: `Sub service not found into system.!`,
        });
      }
    }
  } catch (error) {
    removeFile(subServiceImage);
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createSubServices,
  getAllSubServices,
  getSubServices,
  getSingleSubServices,
  deleteSubServices,
  editSubServices,
};
