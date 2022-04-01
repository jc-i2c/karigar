const router = require("express").Router();

const user = require("../routes/user");
const services = require("../routes/services");
const subservices = require("../routes/subservices");
const serviceprovider = require("../routes/serviceprovider");
const privacypolicy = require("../routes/privacypolicy");
const termscondition = require("../routes/termscondition");
const custsuptitle = require("../routes/custsuptitle");
const custsupsubtitle = require("../routes/custsupsubtitle");

router.use("/karigar/user", user);

router.use("/karigar/services", services);

router.use("/karigar/subservices", subservices);

router.use("/karigar/serviceprovider", serviceprovider);

router.use("/karigar/privacypolicy", privacypolicy);

router.use("/karigar/termscondition", termscondition);

router.use("/karigar/custsuptitle", custsuptitle);

router.use("/karigar/custsupsubtitle", custsupsubtitle);

module.exports = router;
