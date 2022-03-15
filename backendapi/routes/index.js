const router = require("express").Router();

const user = require("../routes/user");
const services = require("../routes/services");
const subservices = require("../routes/subservices");
const serviceprovider = require("../routes/serviceprovider");

router.use("/karigar/user", user);

router.use("/karigar/services", services);

router.use("/karigar/subservices", subservices);

router.use("/karigar/serviceprovider", serviceprovider);

module.exports = router;
