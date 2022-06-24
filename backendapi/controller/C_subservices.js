var moment = require("moment");
const mongoose = require("mongoose");
const Subservices = require("../models/M_subservices");
const Services = require("../models/M_services");
const Servicehistory = require("../models/M_service_history");
const Serviceprovider = require("../models/M_serviceprovider");
const Servicerating = require("../models/M_service_rating");

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

// Get all sub services API.
const getAllSubServices = async (req, res, next) => {
  try {
    const getQry = await Subservices.find({ deleted: false }).populate({
      path: "servicesid",
      select: "servicename serviceimage",
    });
    let findData = [];
    if (getQry.length > 0) {
      let resData = {};
      getQry.map((data) => {
        resData = data.toObject();
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

// Get all sub services based on service Id API.
const getSubServices = async (req, res, next) => {
  try {
    let servicesId = req.body.servicesid;

    if (mongoose.isValidObjectId(servicesId)) {
      const getQry = await Subservices.find({ deleted: false })
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
        getQry.map((data) => {
          resData = data.toObject();

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

// Get single sub services API.
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
      }).where({ deleted: false });

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
            await Subservices.findByIdAndUpdate(allServices._id, {
              $set: { deleted: true },
            });
            // await Subservices.findByIdAndDelete(allServices._id);
            // removeFile(allServices.subserviceimage);
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

// Search sub services API.
const searchSubServices = async (req, res, next) => {
  try {
    let servicesId = new mongoose.Types.ObjectId(req.body.servicesid);
    let subServiceName = req.body.subservicename;

    if (servicesId) {
      const getQry = await Subservices.find({
        subservicename: { $regex: ".*" + subServiceName + ".*", $options: "i" },
        deleted: false,
      })
        .populate({
          path: "servicesid",
          select: "servicename",
        })
        .where({ servicesid: servicesId });

      let findData = [];
      if (getQry.length > 0) {
        let resData = {};
        getQry.map((data) => {
          resData = data.toObject();

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
        message: `Service Id is required.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Search sub services for home pages API(GLOBAL SEARCH).
const searchAllServices = async (req, res, next) => {
  try {
    let text = req.body.text;

    let findSubServices = await Subservices.find({
      subservicename: { $regex: ".*" + text + ".*", $options: "i" },
    })
      .select("subservicename subserviceimage")
      .populate({
        path: "servicesid",
        select: "servicename",
      });

    let returnedObject = [];
    if (findSubServices.length > 0) {
      await Promise.all(
        findSubServices.map(async (item1) => {
          let servicecount = 0;
          let ratingcount = 0;
          let averagerate = 0;
          let findServiceProvider = await Serviceprovider.find()
            .where({
              subserviceid: item1._id,
            })
            .select("_id");

          await Promise.all(
            findServiceProvider.map(async (item2) => {
              let subServiceCount = await Servicehistory.find()
                .where({
                  serviceproviderid: item2._id,
                })
                .count();
              servicecount = +subServiceCount;

              let ratingCount = await Servicerating.find()
                .where({
                  serviceproviderid: item2._id,
                })
                .select("rate");

              ratingcount = ratingCount.length;

              if (ratingCount.length > 0) {
                ratingCount.map((rate) => {
                  averagerate = averagerate + rate.rate;
                });

                averagerate = averagerate / ratingcount;
              }

              averagerate = averagerate;
            })
          );
          returnedObject = [
            ...returnedObject,
            { ...item1._doc, servicecount, ratingcount, averagerate },
          ];
        })
      );

      return res.send({
        status: true,
        message: `${findSubServices.length} Data found into system.`,
        data: returnedObject,
      });
    } else {
      return res.send({
        status: false,
        message: `Data not found into system.`,
      });
    }
  } catch (error) {
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
  searchSubServices,
  searchAllServices,
};
