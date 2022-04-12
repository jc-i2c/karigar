const FavoriteService = require("../models/M_favorite_service");

// Create favorite subservice API.
const createFavSer = async (req, res, next) => {
  try {
    const { customerid, subserviceid } = req.body;

    const getQry = await FavoriteService.findOne().where({
      subserviceid: subserviceid,
      customerid: customerid,
    });

    if (getQry) {
      if (getQry.isfavorite) {
        const result = await FavoriteService.findByIdAndUpdate(getQry._id, {
          $set: { isfavorite: false },
        });

        if (result) {
          return res.send({
            status: true,
            message: `Unfavorite subservice.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Favorite subservice in occurred error.`,
          });
        }
      } else {
        const result = await FavoriteService.findByIdAndUpdate(getQry._id, {
          $set: { isfavorite: true },
        });

        if (result) {
          return res.send({
            status: true,
            message: `Favorite subservice.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Favorite subservice in occurred error.`,
          });
        }
      }
    } else {
      var favoriteService = new FavoriteService({
        customerid: customerid,
        subserviceid: subserviceid,
        isfavorite: true,
      });

      const insertQry = await favoriteService.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Favorite subservice created.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Favorite subservice not created.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get customer favorite subservice based on customer Id API.
const getCustomerFavSer = async (req, res, next) => {
  try {
    const { customerid } = req.body;

    const getQry = await FavoriteService.find()
      .where({
        customerid: customerid,
        isfavorite: true,
      })
      .select("subserviceid isfavorite");

    if (getQry.length > 0) {
      return res.send({
        status: true,
        message: `${getQry.length} Customer favorite subservice found.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${getQry.length} Customer favorite subservice not found.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = { createFavSer, getCustomerFavSer };
