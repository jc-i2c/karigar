const Users = require("../models/M_user");
const Services = require("../models/M_services");
const Offer = require("../models/M_offer");

// Get admin dashboard widget data API.
const getWidgetData = async (req, res, next) => {
  try {
    let widgetsdata = [];

    // Get total users.
    let getTotalUsers = await Users.find().count();
    // console.log(getTotalUsers, "getTotalUsers");

    // // Get total customer.
    // let getCustomerTotal = await Users.find()
    //   .where({
    //     userroll: "626113fadf6c093c730a54fa",
    //     isactive: true,
    //   })
    //   .count();

    // Get total services provider.
    let getServicesProviderTotal = await Users.find()
      .where({
        userroll: "62611430df6c093c730a5504",
        isactive: true,
      })
      .count();

    // Get total services.
    let getServicesTotal = await Services.find().count();

    // Get total offers.
    let getOffersTotal = await Offer.find()
      .where({
        isactive: true,
      })
      .count();

    widgetsdata.push({
      users: getTotalUsers,
      // customers: getCustomerTotal,
      servicesprovider: getServicesProviderTotal,
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
