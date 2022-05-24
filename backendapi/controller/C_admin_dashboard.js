const Users = require("../models/M_user");
const Services = require("../models/M_services");
const Offer = require("../models/M_offer");
const Userrole = require("../models/M_userrole");

// Get admin dashboard widget data API.
const getWidgetData = async (req, res, next) => {
  try {
    let widgetsdata = [];

    // Get total users.
    let totalUsers = await Users.find({ deleted: false }).count();

    // Get total services provider.
    let getRoleTag = await Userrole.findOne({ roletag: "SERVICEPROVIDER" });

    let totalServProvis = await Users.find({ deleted: false })
      .where({
        userroll: getRoleTag._id,
        isactive: true,
      })
      .count();

    // Get total services.
    let getServicesTotal = await Services.find({ deleted: false }).count();

    // Get total offers.
    let getOffersTotal = await Offer.find({ deleted: false })
      .where({
        isactive: true,
      })
      .count();

    widgetsdata.push({
      users: totalUsers,
      servicesprovider: totalServProvis,
      services: getServicesTotal,
      offers: getOffersTotal,
    });

    return res.send({
      status: true,
      message: `widgets data found into system.`,
      widgetsdata: widgetsdata,
    });
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  getWidgetData,
};
