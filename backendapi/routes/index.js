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
const paymenthistory = require("./payment_history");
const servicerating = require("../routes/service_rating");
const favoriteservice = require("../routes/favorite_service");
const chat_request = require("../routes/chat_request");
const chat_room = require("../routes/chat_room");
const chat = require("../routes/chat");
const offer = require("../routes/offer");
const userrole = require("../routes/userrole");
const systemmodules = require("../routes/system_modules");
const dashboard = require("../routes/dashboard");

router.use("/karigar/user", user);

router.use("/karigar/services", services);

router.use("/karigar/subservices", subservices);

router.use("/karigar/serviceprovider", serviceprovider);

router.use("/karigar/privacypolicy", privacypolicy);

router.use("/karigar/termscondition", termscondition);

router.use("/karigar/custsuptitle", custsuptitle);

router.use("/karigar/custsupsubtitle", custsupsubtitle);

router.use("/karigar/servicehistory", servicehistory);

router.use("/karigar/paymenthistory", paymenthistory);

router.use("/karigar/servicerating", servicerating);

router.use("/karigar/favoriteservice", favoriteservice);

router.use("/karigar/chatrequest", chat_request);

router.use("/karigar/chatroom", chat_room);

router.use("/karigar/chat", chat);

router.use("/karigar/offer", offer);

router.use("/karigar/userrole", userrole);

router.use("/karigar/systemmodules", systemmodules);

router.use("/karigar/dashboard", dashboard);

module.exports = router;
