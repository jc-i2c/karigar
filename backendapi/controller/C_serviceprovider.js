const mongoose = require("mongoose");
const Serviceprovider = require("../models/M_serviceprovider");

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
          isSuccess: false,
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
            isSuccess: true,
            message: `Service provider craeted.`,
          });
        } else {
          return res.send({
            isSuccess: false,
            message: `Service provider not craeted.`,
          });
        }
      }
    } else {
      if (req.file) removeFile(serProviderImage);
      return res.send({
        isSuccess: false,
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
    const getQry = await Serviceprovider.find({
      subserviceid: req.body.subserviceid,
      isactive: true,
    });

    if (getQry.length > 0) {
      return res.send({
        isSuccess: true,
        message: `${getQry.length} Service provider found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        isSuccess: false,
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
      const getQry = await Serviceprovider.findById(servicesProviderId);

      if (getQry) {
        return res.send({
          isSuccess: true,
          message: `Service provider found into system.`,
          data: getQry,
        });
      } else {
        return res.send({
          isSuccess: false,
          message: `Service provider not found into system.`,
        });
      }
    } else {
      return res.send({
        isSuccess: false,
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
        isSuccess: false,
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
          isSuccess: true,
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
            isSuccess: true,
            message: `${cntServices} Service provider deleted.!`,
          });
        } else if (cntServices > 0) {
          return res.send({
            isSuccess: true,
            message: `Service provider deleted ${cntServices} out of ${totalServices} service provider.!`,
          });
        } else {
          return res.send({
            isSuccess: true,
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
        isSuccess: false,
        message: `Service provider ID is not allowed to be empty`,
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
          isSuccess: false,
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
            isSuccess: true,
            message: `Service provider updated.!`,
          });
        } else {
          removeFile(Image);
          return res.send({
            isSuccess: false,
            message: `Service provider not updated.!`,
          });
        }
      } else {
        removeFile(Image);
        return res.send({
          isSuccess: false,
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

module.exports = {
  createProvider,
  getAllProvider,
  getSingleProvider,
  deleteProvider,
  editProvider,
};
