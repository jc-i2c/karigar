const mongoose = require("mongoose");
const Serviceprovider = require("../models/M_serviceprovider");
const Subservices = require("../models/M_subservices");
const Offer = require("../models/M_offer");
const ServiceHistory = require("../models/M_service_history");
const ServiceRating = require("../models/M_service_rating");
var moment = require("moment");

const { createSerProVal, editSerProVal } = require("../helper/joivalidation");
const { removeFile } = require("../helper/removefile");

// Create new services provider with details API (Only adminpanel side).
const createProvider = async (req, res, next) => {
  try {
    let data = {
      name: req.body.name,
      description: req.body.description,
      userid: req.body.userid,
      subserviceid: req.body.subserviceid,
      price: req.body.price,
      servicedetails: JSON.parse(req.body.servicedetails),
    };

    if (req.file) {
      var serProviderImage = req.file.filename;
      // Joi validation.
      const { error } = createSerProVal(data);
      if (error) {
        removeFile(serProviderImage);

        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });
        return res.send({
          status: false,
          message: errorMsg,
        });
      } else {
        var createProvider = new Serviceprovider({
          name: data.name,
          description: data.description,
          userid: data.userid,
          subserviceid: data.subserviceid,
          image: serProviderImage,
          price: data.price,
          servicedetails: data.servicedetails,
        });

        const insertQry = await createProvider.save();
        if (insertQry) {
          return res.send({
            status: true,
            message: `Service provider created.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Service provider not created.`,
          });
        }
      }
    } else {
      if (req.file) removeFile(serProviderImage);
      return res.send({
        status: false,
        message: `Service provider image is required.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    removeFile(serProviderImage);
    next(error);
  }
};

// Edit services provider API.
const editProvider = async (req, res, next) => {
  try {
    let data = {
      serviceproviderid: req.body.serviceproviderid,
      userid: req.body.userid,
      name: req.body.name,
      description: req.body.description,
      subserviceid: req.body.subserviceid,
      price: req.body.price,
      image: req.body.image,
      servicedetails: JSON.parse(req.body.servicedetails),
    };

    if (req.file) {
      var newImage = req.file.filename;
      data.image = newImage;
    }

    if (!data.serviceproviderid) {
      removeFile(newImage);

      return res.send({
        status: false,
        message: `Service provider ID is not allowed to be empty.`,
      });
    } else {
      // Joi validation.
      let { error } = editSerProVal(data);

      if (error) {
        removeFile(newImage);

        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      }
      let findQry = await Serviceprovider.findById(data.serviceproviderid);

      if (findQry) {
        servicename = data.servicename;

        var updateData = {
          name: data.name,
          userid: data.userid,
          description: data.description,
          subserviceid: data.subserviceid,
          price: data.price,
          image: data.image,
          servicedetails: data.servicedetails,
        };

        let updateQry = await Serviceprovider.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          if (req.file) {
            removeFile(findQry.image);
          }

          return res.send({
            status: true,
            message: `Service provider updated.!`,
          });
        } else {
          removeFile(newImage);
          return res.send({
            status: false,
            message: `Service provider not updated.!`,
          });
        }
      } else {
        removeFile(newImage);
        return res.send({
          status: false,
          message: `Service provider not found into system.!`,
        });
      }
    }
  } catch (error) {
    removeFile(newImage);
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all services provider API.
const getAllProvider = async (req, res, next) => {
  try {
    const subServiceId = req.body.subserviceid;

    if (mongoose.Types.ObjectId.isValid(subServiceId)) {
      const getQry = await Serviceprovider.find({
        subserviceid: subServiceId,
        isactive: true,
        deleted: false,
      })
        .populate({ path: "userid", select: "name" })
        .populate({
          path: "subserviceid",
          select: "subservicename subserviceimage",
          populate: { path: "servicesid", select: "servicename serviceimage" },
        });

      if (getQry.length > 0) {
        let serviceProvider = await Promise.all(
          getQry.map(async (dataList) => {
            let objectData = {};
            objectData = dataList.toJSON();

            let findOffer = await Offer.findOne()
              .where({
                subserviceid: objectData.subserviceid._id,
                serviceproviderid: objectData._id,
                isactive: true,
              })
              .select("currentprice");

            if (findOffer) {
              objectData.currentprice = findOffer.currentprice;
              objectData.actualprice = objectData.price;
              return objectData;
            } else {
              objectData.currentprice = objectData.price;
              delete objectData.price;
              return objectData;
            }
          })
        );

        return res.send({
          status: true,
          message: `${serviceProvider.length} Service provider found into system.`,
          data: serviceProvider,
        });
      } else {
        return res.send({
          status: false,
          message: `${getQry.length} Service provider not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service provider not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get single services provider API.
const getSingleProvider = async (req, res, next) => {
  try {
    const servicesProviderId = req.body.servicesproviderid;

    if (mongoose.isValidObjectId(servicesProviderId)) {
      let getQry = await Serviceprovider.findById(servicesProviderId)
        .where({ $and: [{ isactive: true }, { deleted: false }] })
        .populate({ path: "userid", select: "name" })
        .populate({
          path: "subserviceid",
          select: "subservicename subserviceimage",
          populate: { path: "servicesid", select: "servicename serviceimage" },
        });

      if (getQry) {
        getQry = getQry.toJSON();

        // Find offers API.
        let findOffer = await Offer.findOne()
          .where({
            serviceproviderid: getQry._id,
            isactive: true,
          })
          .select("currentprice");

        if (findOffer) {
          getQry.currentprice = findOffer.currentprice;
          getQry.actualprice = getQry.price;
          delete getQry.price;
        } else {
          getQry.currentprice = getQry.price;
          delete getQry.price;
        }

        // Count jobs based on service provider API.
        let countjob = await ServiceHistory.find()
          .where({ serviceproviderid: servicesProviderId })
          .count();

        if (countjob) {
          getQry.countjob = countjob;
        } else {
          getQry.countjob = 0;
        }

        // Count service provider rate count and average find API.
        const countRate = await ServiceRating.find()
          .where({
            serviceproviderid: servicesProviderId,
          })
          .select("rate");

        if (countRate.length > 0) {
          let averageRate = 0;
          let totalCnt = countRate.length;

          countRate.map((rate) => {
            averageRate = averageRate + rate.rate;
          });

          averageRate = averageRate / totalCnt;

          getQry.totalrate = countRate.length;
          getQry.averagerate = averageRate;
        } else {
          getQry.totalrate = 0;
          getQry.averagerate = 0;
        }

        return res.send({
          status: true,
          message: `Service provider found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          status: false,
          message: `Service provider not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service provider ID is not valid.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete single services provider API.
const deleteProvider = async (req, res, next) => {
  try {
    const servicesProviderId = req.body.servicesproviderid;

    if (!servicesProviderId) {
      return res.send({
        status: false,
        message: `Service provider Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await Serviceprovider.find({
        _id: {
          $in: servicesProviderId,
        },
      });

      var totalServices = findQry.length;
      var cntServices = 0;

      if (totalServices <= 0) {
        return res.send({
          status: true,
          message: `${cntServices} service provider found into system.!`,
        });
      } else {
        // Array of all service provider.
        await Promise.all(
          findQry.map(async (allProvider) => {
            cntServices = cntServices + 1;
            await Serviceprovider.findByIdAndUpdate(allProvider._id, {
              $set: { deleted: true },
            });
            // await Serviceprovider.findByIdAndDelete(allProvider._id);
            // removeFile(allProvider.image);
          })
        );

        if (totalServices == cntServices) {
          return res.send({
            status: true,
            message: `${cntServices} Service provider deleted.!`,
          });
        } else if (cntServices > 0) {
          return res.send({
            status: true,
            message: `Service provider deleted ${cntServices} out of ${totalServices} service provider.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalServices} service provider but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all service provider based on sub services API.
const getAllProviderList = async (req, res, next) => {
  try {
    const subServiceId = req.body.subserviceid;

    if (mongoose.Types.ObjectId.isValid(subServiceId)) {
      const getQry = await Serviceprovider.find({
        subserviceid: subServiceId,
        isactive: true,
        deleted: false,
      })
        .select("description price image name")
        .populate({
          path: "subserviceid",
          select: "subservicename",
        });

      if (getQry.length > 0) {
        let serviceProvider = await Promise.all(
          getQry.map(async (dataList) => {
            let objectData = {};
            objectData = dataList.toJSON();

            let findOffer = await Offer.findOne()
              .where({
                subserviceid: objectData.subserviceid._id,
                serviceproviderid: objectData._id,
                isactive: true,
              })
              .select("currentprice");

            if (findOffer) {
              objectData.currentprice = findOffer.currentprice;
              objectData.actualprice = objectData.price;
              delete objectData.price;
              return objectData;
            } else {
              objectData.currentprice = objectData.price;
              delete objectData.price;
              return objectData;
            }
          })
        );

        return res.send({
          status: true,
          message: `${getQry.length} Service provider found into system.`,
          data: serviceProvider,
        });
      } else {
        return res.send({
          status: false,
          message: `${getQry.length} Service provider not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Service provider not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Admin add services provider details dynamically API. (Only postman use)
const addServiceProviderDetails = async (req, res, next) => {
  try {
    let serviceProviderId = req.body.serviceproviderid;
    let data = req.body;

    if (!serviceProviderId) {
      return res.send({
        status: false,
        message: `Service provider Id is required.`,
      });
    } else if (!data) {
      return res.send({
        status: false,
        message: `Service provider details is required.`,
      });
    } else {
      let findQry = await Serviceprovider.findOne({ _id: serviceProviderId });

      if (findQry) {
        let detailsData = [];

        delete data["serviceproviderid"];

        for (const key in data) {
          let tempObj = {};
          tempObj.name = `${key}`;
          tempObj.value = `${data[key]}`;

          detailsData.push(tempObj);
        }

        let updateQry = await Serviceprovider.findByIdAndUpdate(findQry._id, {
          $set: { servicedetails: detailsData },
        });

        if (updateQry) {
          return res.send({
            status: true,
            message: `Service provider details updated.!`,
          });
        } else {
          return res.send({
            status: false,
            message: `Service provider details not updated.!`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Service provider details not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all service provider list API.
const getAllServiceProvider = async (req, res, next) => {
  try {
    let getQry = await Serviceprovider.find({ deleted: false })
      .populate({
        path: "userid",
        select: "name",
      })
      .populate({
        path: "subserviceid",
        select: "subservicename",
        populate: {
          path: "servicesid",
          select: "servicename",
        },
      });

    if (getQry.length > 0) {
      return res.send({
        status: true,
        message: `${getQry.length} Service provider found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Service provider list not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Service provider active or deactive API.
const changeStatus = async (req, res, next) => {
  try {
    const serviceProviderId = req.body.serviceproviderid;

    if (
      !serviceProviderId ||
      serviceProviderId == null ||
      serviceProviderId == undefined ||
      serviceProviderId == "null" ||
      serviceProviderId == "undefined"
    ) {
      return res.send({
        status: false,
        message: `Service provider id is required.`,
      });
    } else {
      const findQry = await Serviceprovider.findById(serviceProviderId);

      if (findQry) {
        if (findQry.isactive == true) {
          let isActive = { isactive: false };
          let updateQry = await Serviceprovider.findByIdAndUpdate(findQry._id, {
            $set: isActive,
          });
          if (updateQry) {
            return res.send({
              status: true,
              message: `Service provider Deactivated.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Data not updated.`,
            });
          }
        } else if (findQry.isactive == false) {
          let isActive = { isactive: true };
          let updateQry = await Serviceprovider.findByIdAndUpdate(findQry._id, {
            $set: isActive,
          });
          if (updateQry) {
            return res.send({
              status: true,
              message: `Service provider Activated.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Data not updated.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `Service provider not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all services based on TOKEN API.
const getServiceList = async (req, res, next) => {
  try {
    let userId = new mongoose.Types.ObjectId(req.userid);
    if (userId) {
      let getQry = await Serviceprovider.find({ deleted: false })
        .where({ userid: userId })
        .select("subserviceid")
        .populate({
          path: "subserviceid",
          select: "_id",
          populate: {
            path: "servicesid",
            select: "servicename serviceimage createdAt updatedAt",
          },
        });

      let findData = [];
      if (getQry.length > 0) {
        let resData = {};
        getQry.map((list) => {
          resData = list.toObject();

          // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          createDate = resData.subserviceid.servicesid.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          resData.subserviceid.servicesid.createdAt = moment(createDate).format(
            "DD-MM-YYYY HH:MM:SS"
          );

          // updatedAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          updateDate = resData.subserviceid.servicesid.updatedAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          resData.subserviceid.servicesid.updatedAt = moment(updateDate).format(
            "DD-MM-YYYY HH:MM:SS"
          );

          findData.push(resData);
        });

        return res.send({
          status: true,
          message: `${findData.length} Service provider found into system.`,
          data: findData,
        });
      } else {
        return res.send({
          status: false,
          message: `Service provider list not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `User Id is required.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all sub services based on TOKEN API.
const getSubServiceList = async (req, res, next) => {
  try {
    let userId = req.userid;
    var ObjectId = require("mongoose").Types.ObjectId;

    let serviceId = req.body.servicesid;

    if (serviceId) {
      let findSubService = await Subservices.find({
        servicesid: ObjectId(serviceId),
        deleted: false,
      }).populate({ path: "servicesid", select: "servicename" });

      let finalResult = [];
      if (findSubService.length > 0) {
        let getQry = await Serviceprovider.find()
          .where({ userid: ObjectId(userId) })
          .select("subserviceid");

        finalResult = findSubService.filter((o1) =>
          getQry.some((o2) => o1.id === o2.subserviceid.toString())
        );

        finalResult = finalResult.map((chnageDate) => {
          let newObj = chnageDate.toObject();

          // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          createDate = newObj.createdAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          newObj.createdAt = moment(createDate).format("DD-MM-YYYY HH:MM:SS");

          // updatedAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
          updateDate = newObj.updatedAt
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          newObj.updatedAt = moment(updateDate).format("DD-MM-YYYY HH:MM:SS");
          delete newObj["__v"];

          return newObj;
        });
      }

      return res.send({
        status: true,
        message: `${finalResult.length} Sub service found into system.`,
        data: finalResult,
      });
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

// Get all service provide list based on service provider ID API.
const getSerProOwnList = async (req, res, next) => {
  try {
    let userId = req.userid;
    var ObjectId = require("mongoose").Types.ObjectId;

    userId = ObjectId(userId);
    if (userId) {
      let getQry = await Serviceprovider.find({ deleted: false })
        .where({ userid: userId })
        .populate({
          path: "userid",
          select: "name",
        })
        .populate({
          path: "subserviceid",
          select: "subservicename",
          populate: {
            path: "servicesid",
            select: "servicename",
          },
        });

      return res.send({
        status: true,
        message: `${getQry.length} Service provider found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `Service provider Id is required.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get service provider name ONLY LOGIN service provider NAME API.
const getProviderList = async (req, res, next) => {
  try {
    let subServiceId = new mongoose.Types.ObjectId(req.body.subserviceid);
    let userId = new mongoose.Types.ObjectId(req.userid);

    let findQry = await Serviceprovider.findOne({
      subserviceid: subServiceId,
      userid: userId,
      deleted: false,
    }).select("name price");

    if (findQry) {
      return res.send({
        status: true,
        message: `Service provider found into system.`,
        data: findQry,
      });
    } else {
      return res.send({
        status: false,
        message: `Service provider not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Search service provider API.
const searchServiceProvider = async (req, res, next) => {
  try {
    const subServiceId = req.body.subserviceid;
    let serviceProviderName = req.body.name;

    if (mongoose.Types.ObjectId.isValid(subServiceId)) {
      const getQry = await Serviceprovider.find({
        subserviceid: subServiceId,
        isactive: true,
        deleted: false,
      })
        .where({
          name: {
            $regex: ".*" + serviceProviderName + ".*",
            $options: "i",
          },
        })
        .populate({ path: "userid", select: "name" })
        .populate({
          path: "subserviceid",
          select: "subservicename subserviceimage",
          populate: { path: "servicesid", select: "servicename serviceimage" },
        });

      if (getQry.length > 0) {
        let serviceProvider = await Promise.all(
          getQry.map(async (dataList) => {
            let objectData = {};
            objectData = dataList.toJSON();

            let findOffer = await Offer.findOne()
              .where({
                subserviceid: objectData.subserviceid._id,
                serviceproviderid: objectData._id,
                isactive: true,
              })
              .select("currentprice actualprice");

            if (findOffer) {
              objectData.currentprice = findOffer.currentprice;
              objectData.actualprice = objectData.price;
              return objectData;
            } else {
              objectData.currentprice = objectData.price;
              delete objectData.price;
              return objectData;
            }
          })
        );

        return res.send({
          status: true,
          message: `${serviceProvider.length} Service provider found into system.`,
          data: serviceProvider,
        });
      } else {
        return res.send({
          status: false,
          message: `${getQry.length} Service provider not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Service provider not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createProvider,
  editProvider,
  getAllProvider,
  getSingleProvider,
  deleteProvider,
  getAllProviderList,
  addServiceProviderDetails,
  getAllServiceProvider,
  changeStatus,
  getServiceList,
  getSubServiceList,
  getSerProOwnList,
  getProviderList,
  searchServiceProvider,
};
