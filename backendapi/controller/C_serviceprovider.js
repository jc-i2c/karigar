const mongoose = require("mongoose");
const Serviceprovider = require("../models/M_serviceprovider");
const Offer = require("../models/M_offer");

const { createSerProVal, editSerProVal } = require("../helper/joivalidation");
const { removeFile } = require("../helper/removefile");

// Create new services provider API.
const createProvider = async (req, res, next) => {
  try {
    let data = {
      name: req.body.name,
      description: req.body.description,
      userid: req.body.userid,
      subserviceid: req.body.subserviceid,
      price: req.body.price,
      duration: req.body.duration,
      turnaroundtime: req.body.turnaroundtime,
      pricing: req.body.pricing,
      bathroomcleaning: req.body.bathroomcleaning,
      kitchencleaning: req.body.kitchencleaning,
      bedroomcleaning: req.body.bedroomcleaning,
      sofacleaning: req.body.sofacleaning,
      carpetcleaning: req.body.carpetcleaning,
      balconycleaning: req.body.balconycleaning,
      fridgecleaning: req.body.fridgecleaning,
      overcleaning: req.body.overcleaning,
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
          details: {
            duration: data.duration,
            turnaroundtime: data.turnaroundtime,
            pricing: data.pricing,
            bathroomcleaning: data.bathroomcleaning,
            kitchencleaning: data.kitchencleaning,
            bedroomcleaning: data.bedroomcleaning,
            sofacleaning: data.sofacleaning,
            carpetcleaning: data.carpetcleaning,
            balconycleaning: data.balconycleaning,
            fridgecleaning: data.fridgecleaning,
            overcleaning: data.overcleaning,
          },
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

// Gel all services provider API.
const getAllProvider = async (req, res, next) => {
  try {
    const subServiceId = req.body.subserviceid;

    if (mongoose.Types.ObjectId.isValid(subServiceId)) {
      const getQry = await Serviceprovider.find({
        subserviceid: subServiceId,
        isactive: true,
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
              delete objectData.price;
              objectData.currentprice = findOffer.currentprice;
              objectData.actualprice = findOffer.actualprice;
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

// Gel single services provider API.
const getSingleProvider = async (req, res, next) => {
  try {
    const servicesProviderId = req.body.servicesproviderid;

    if (mongoose.isValidObjectId(servicesProviderId)) {
      let getQry = await Serviceprovider.findById(servicesProviderId)
        .where({ isactive: true })
        .populate({ path: "userid", select: "name" })
        .populate({
          path: "subserviceid",
          select: "subservicename subserviceimage",
          populate: { path: "servicesid", select: "servicename serviceimage" },
        });

      if (getQry) {
        getQry = getQry.toJSON();

        let findOffer = await Offer.findOne()
          .where({
            serviceproviderid: getQry._id,
            isactive: true,
          })
          .select("currentprice actualprice");

        if (findOffer) {
          delete getQry.price;
          getQry.currentprice = findOffer.currentprice;
          getQry.actualprice = findOffer.actualprice;
        } else {
          getQry.currentprice = getQry.price;
          delete getQry.price;
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
        // Array of all services.
        await Promise.all(
          findQry.map(async (allServiceProvider) => {
            cntServices = cntServices + 1;
            await Serviceprovider.findByIdAndDelete(allServiceProvider._id);
            removeFile(allServiceProvider.image);
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

// Edit services provider API.
const editProvider = async (req, res, next) => {
  try {
    let data = {
      serviceproviderid: req.body.serviceproviderid,
      name: req.body.name,
      description: req.body.description,
      subserviceid: req.body.subserviceid,
      price: req.body.price,
      duration: req.body.duration,
      turnaroundtime: req.body.turnaroundtime,
      pricing: req.body.pricing,
      bathroomcleaning: req.body.bathroomcleaning,
      kitchencleaning: req.body.kitchencleaning,
      bedroomcleaning: req.body.bedroomcleaning,
      sofacleaning: req.body.sofacleaning,
      carpetcleaning: req.body.carpetcleaning,
      balconycleaning: req.body.balconycleaning,
      fridgecleaning: req.body.fridgecleaning,
      overcleaning: req.body.overcleaning,
    };

    if (req.file) {
      var Image = req.file.filename;
    }

    if (!data.serviceproviderid) {
      removeFile(Image);

      return res.send({
        status: false,
        message: `Service provider ID is not allowed to be empty.`,
      });
    } else {
      // Joi validation.
      let { error } = editSerProVal(data);

      if (error) {
        removeFile(Image);

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
          description: data.description,
          subserviceid: data.subserviceid,
          price: data.price,
          details: {
            duration: data.duration,
            turnaroundtime: data.turnaroundtime,
            pricing: data.pricing,
            bathroomcleaning: data.bathroomcleaning,
            kitchencleaning: data.kitchencleaning,
            bedroomcleaning: data.bedroomcleaning,
            sofacleaning: data.sofacleaning,
            carpetcleaning: data.carpetcleaning,
            balconycleaning: data.balconycleaning,
            fridgecleaning: data.fridgecleaning,
            overcleaning: data.overcleaning,
          },
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
          removeFile(Image);
          return res.send({
            status: false,
            message: `Service provider not updated.!`,
          });
        }
      } else {
        removeFile(Image);
        return res.send({
          status: false,
          message: `Service provider not found into system.!`,
        });
      }
    }
  } catch (error) {
    removeFile(Image);
    // console.log(error, "ERROR");
    next(error);
  }
};

const getAllProviderList = async (req, res, next) => {
  try {
    const subServiceId = req.body.subserviceid;

    if (mongoose.Types.ObjectId.isValid(subServiceId)) {
      const getQry = await Serviceprovider.find({
        subserviceid: subServiceId,
        isactive: true,
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
              .select("currentprice actualprice");

            if (findOffer) {
              delete objectData.price;
              objectData.currentprice = findOffer.currentprice;
              objectData.actualprice = findOffer.actualprice;
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

module.exports = {
  createProvider,
  getAllProvider,
  getSingleProvider,
  deleteProvider,
  editProvider,
  getAllProviderList,
};
