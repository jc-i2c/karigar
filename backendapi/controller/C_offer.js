const Offer = require("../models/M_offer");
const SubServices = require("../models/M_subservices");
const ServiceProvider = require("../models/M_serviceprovider");

const { updateOfferVal } = require("../helper/joivalidation");

// Create offer API.
const createOffer = async (req, res, next) => {
  try {
    const { subserviceid, serviceproviderid, currentprice, actualprice } =
      req.body;

    const findSubService = await SubServices.findById({ _id: subserviceid });
    if (findSubService) {
      const findSubServiceProv = await ServiceProvider.findById({
        _id: serviceproviderid,
      });
      if (findSubServiceProv) {
        const getQry = await Offer.findOne().where({
          subserviceid: subserviceid,
          serviceproviderid: serviceproviderid,
          isactive: true,
        });

        if (getQry) {
          return res.send({
            status: false,
            message: `offer is already active.`,
          });
        } else {
          var offerData = new Offer({
            subserviceid: subserviceid,
            serviceproviderid: serviceproviderid,
            currentprice: currentprice,
            actualprice: actualprice,
          });

          const insertQry = await offerData.save();

          if (insertQry) {
            return res.send({
              status: true,
              message: `offer created.`,
            });
          } else {
            return res.send({
              status: false,
              message: `offer not created.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `Sub service provider not found into system.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `Sub service not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Update offer API.
const updateOffer = async (req, res, next) => {
  try {
    const getQry = await Offer.findById(req.body.offerid);
    if (getQry) {
      const data = {
        offerid: req.body.offerid,
        subserviceid: req.body.subserviceid,
        serviceproviderid: req.body.serviceproviderid,
        currentprice: req.body.currentprice,
        actualprice: req.body.actualprice,
      };

      // Joi validation.
      let { error } = updateOfferVal(data);

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
        const updateQry = {
          subserviceid: data.subserviceid,
          serviceproviderid: data.serviceproviderid,
          currentprice: data.currentprice,
          actualprice: data.actualprice,
        };

        const result = await Offer.findByIdAndUpdate(data.offerid, {
          $set: updateQry,
        });

        if (result) {
          return res.send({
            status: true,
            message: `offer updated.`,
          });
        } else {
          return res.send({
            status: false,
            message: `offer not updated.`,
          });
        }
      }
    } else {
      return res.send({
        status: false,
        message: `offer not exist into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get offer API.
const getAllOffer = async (req, res, next) => {
  try {
    let findQry = await Offer.find()
      .populate({
        path: "subserviceid",
        select: "subservicename subserviceimage",
      })
      .populate({
        path: "serviceproviderid",
        select: "name",
      });

    if (findQry.length > 0) {
      return res.send({
        status: true,
        message: `${findQry.length} offer found into system.`,
        data: findQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${findQry.length} offer not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete offer API.
const deleteOffer = async (req, res, next) => {
  try {
    const offerId = req.body.offerid;

    if (!offerId) {
      return res.send({
        status: false,
        message: `Offer Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await Offer.find({
        _id: {
          $in: offerId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} offer found into system.!`,
        });
      } else {
        // Array of all offer.
        Promise.all([
          findQry.map(async (allOffer) => {
            count = count + 1;
            await Offer.findByIdAndDelete(allOffer._id);
          }),
        ]);

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} offer deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `offer deleted ${count} out of ${totalCount} offer.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} offer but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Active & deactivate offer API.
const changeOfferStatus = async (req, res, next) => {
  try {
    const offerId = req.body.offerid;

    if (!offerId) {
      return res.send({
        status: false,
        message: `offer Id is not allowed to be empty.`,
      });
    } else {
      const getQry = await Offer.findById(offerId);

      if (getQry) {
        if (getQry.isactive) {
          const result = await Offer.findByIdAndUpdate(getQry._id, {
            $set: { isactive: false },
          });

          if (result) {
            return res.send({
              status: true,
              message: `offer deactivate.`,
            });
          } else {
            return res.send({
              status: false,
              message: `offer not deactivate.`,
            });
          }
        } else {
          const result = await Offer.findByIdAndUpdate(getQry._id, {
            $set: { isactive: true },
          });

          if (result) {
            return res.send({
              status: true,
              message: `offer activate.`,
            });
          } else {
            return res.send({
              status: false,
              message: `offer not activate.`,
            });
          }
        }
      } else {
        // Not find
        return res.send({
          status: false,
          message: `offer not fount into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createOffer,
  updateOffer,
  getAllOffer,
  deleteOffer,
  changeOfferStatus,
};
