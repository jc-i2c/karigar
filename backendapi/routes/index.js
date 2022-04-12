const router = require("express").Router();

const user = require("../routes/user");
const services = require("../routes/services");
const subservices = require("../routes/subservices");
const serviceprovider = require("../routes/serviceprovider");
const privacypolicy = require("../routes/privacypolicy");
const termscondition = require("../routes/termscondition");
const custsuptitle = require("../routes/custsuptitle");
const custsupsubtitle = require("../routes/custsupsubtitle");
const servicehistory = require("../routes/service_history");
const payment = require("../routes/payment");
const servicerating = require("../routes/service_rating");
const favoriteservice = require("../routes/favorite_service");

router.use("/karigar/user", user);

router.use("/karigar/services", services);

router.use("/karigar/subservices", subservices);

router.use("/karigar/serviceprovider", serviceprovider);

router.use("/karigar/privacypolicy", privacypolicy);

router.use("/karigar/termscondition", termscondition);

router.use("/karigar/custsuptitle", custsuptitle);

router.use("/karigar/custsupsubtitle", custsupsubtitle);

router.use("/karigar/servicehistory", servicehistory);

router.use("/karigar/payment", payment);

router.use("/karigar/servicerating", servicerating);

router.use("/karigar/favoriteservice", favoriteservice);

module.exports = router;
