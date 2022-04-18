const Joi = require("joi");

// Insert new user record validation.
const insertDataVal = (data) => {
  const insertDataVal = Joi.object().keys({
    emailaddress: Joi.string().email().required().label("Email address"),
    password: Joi.string().min(6).required().label("Password"),
    confirmpassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Confirm password does not match" })
      .label("Confirm password"),
    userroll: Joi.number().required().valid(1, 2, 3).label("Userroll"),
  });
  return insertDataVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Verify otp validation.
const verifyOtpVal = (data) => {
  const verifyOtpVal = Joi.object().keys({
    emailaddress: Joi.string().email().required().label("Email address"),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]{6}/)
      .required()
      .label("OTP"),
  });
  return verifyOtpVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Login validation.
const loginDataVal = (data) => {
  const loginDataVal = Joi.object().keys({
    emailaddress: Joi.string().email().required().label("Email Address"),
    password: Joi.string().min(6).required().label("Password"),
  });
  return loginDataVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Update user profile validation.
const updateProfileDataVal = (data) => {
  const updateProfileDataVal = Joi.object().keys({
    name: Joi.string().min(3).required().label("Name"),
    gender: Joi.string().length(1).required().label("Gender"),
    mobilenumber: Joi.string()
      .length(10)
      // .pattern(/[6-9]{1}[0-9]{9}/)
      .required()
      .label("Mobile number"),
    // location: Joi.string().required().label("Location"),
  });
  return updateProfileDataVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Change user password validation.
const changePasswordVal = (data) => {
  const changePasswordVal = Joi.object().keys({
    oldpassword: Joi.string().min(6).required().label("Old password"),
    newpassword: Joi.string().min(6).required().label("New password"),
    confirmpassword: Joi.any()
      .valid(Joi.ref("newpassword"))
      .required()
      .messages({ "any.only": "Confirm password does not match" })
      .label("Confirm password"),
  });
  return changePasswordVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Reset user password validation.
const resetPasswordVal = (data) => {
  const changePasswordVal = Joi.object().keys({
    emailaddress: Joi.string().email().required().label("Email address"),
  });
  return changePasswordVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create services validation.
const createServicesVal = (data) => {
  const createServicesVal = Joi.object().keys({
    servicename: Joi.string().required().min(3).label("Service name"),
  });
  return createServicesVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Edit services validation.
const editServicesVal = (data) => {
  const createServicesVal = Joi.object().keys({
    servicesid: Joi.string().required().label("Service Id"),
    servicename: Joi.string().required().min(3).label("Service name"),
  });
  return createServicesVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create sub services validation.
const createSubServicesVal = (data) => {
  const createSubServicesVal = Joi.object().keys({
    servicesid: Joi.string().required().label("Service Id"),
    subservicename: Joi.string().required().min(3).label("Sub service name"),
  });
  return createSubServicesVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Edit sub services validation.
const editSubServicesVal = (data) => {
  const editSubServicesVal = Joi.object().keys({
    subservicesid: Joi.string().required().label("Sub service Id"),
    servicesid: Joi.string().required().label("Service Id"),
    subservicename: Joi.string().required().min(3).label("Sub service name"),
  });
  return editSubServicesVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create service provider validation.
const createSerProVal = (data) => {
  const createSerProVal = Joi.object().keys({
    name: Joi.string().required().label("Service provider name"),
    description: Joi.string().required().label("Service provider description"),
    userid: Joi.string().required().label("User Id"),
    subserviceid: Joi.string().required().label("Sub service Id"),
    price: Joi.number().required().label("Price"),
    duration: Joi.string().required().label("Duration"),
    turnaroundtime: Joi.string().required().label("Turnaround time"),
    pricing: Joi.string()
      .default("fixed")
      .required()
      .label("Service provider name"),
    bathroomcleaning: Joi.boolean().default(true).label("Bathroom cleaning"),
    kitchencleaning: Joi.boolean().default(true).label("Kitchen cleaning"),
    bedroomcleaning: Joi.boolean().default(true).label("Bedroom cleaning"),
    sofacleaning: Joi.boolean().default(true).label("Sofa cleaning"),
    carpetcleaning: Joi.boolean().default(true).label("Carpet cleaning"),
    balconycleaning: Joi.boolean().default(true).label("Balcony cleaning"),
    fridgecleaning: Joi.boolean().default(true).label("Fridge cleaning"),
    overcleaning: Joi.boolean().default(true).label("Over cleaning"),
  });
  return createSerProVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create service provider validation.
const editSerProVal = (data) => {
  const editSerProVal = Joi.object().keys({
    serviceproviderid: Joi.string().required().label("Service provider id"),
    name: Joi.string().required().label("Service provider name"),
    description: Joi.string().required().label("Service provider description"),
    subserviceid: Joi.string().required().label("Sub service Id"),
    price: Joi.number().required().label("Price"),
    duration: Joi.string().required().label("Duration"),
    turnaroundtime: Joi.string().required().label("Turnaround time"),
    pricing: Joi.string()
      .default("fixed")
      .required()
      .label("Service provider name"),
    bathroomcleaning: Joi.boolean().default(true).label("Bathroom cleaning"),
    kitchencleaning: Joi.boolean().default(true).label("Kitchen cleaning"),
    bedroomcleaning: Joi.boolean().default(true).label("Bedroom cleaning"),
    sofacleaning: Joi.boolean().default(true).label("Sofa cleaning"),
    carpetcleaning: Joi.boolean().default(true).label("Carpet cleaning"),
    balconycleaning: Joi.boolean().default(true).label("Balcony cleaning"),
    fridgecleaning: Joi.boolean().default(true).label("Fridge cleaning"),
    overcleaning: Joi.boolean().default(true).label("Over cleaning"),
  });
  return editSerProVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Edit Terms condition validation.
const editTermsConditionVal = (data) => {
  const editTermsConditionVal = Joi.object().keys({
    termsconditionid: Joi.string().required().label("Terms condition Id"),
    title: Joi.string().required().min(3).label("Terms condition title"),
    description: Joi.string().required().label("Terms condition description"),
  });
  return editTermsConditionVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Edit customer support title validation.
const editCusSupTitleVal = (data) => {
  const editCusSupTitleVal = Joi.object().keys({
    custsuptitleid: Joi.string().required().label("Customer support Id"),
    title: Joi.string().required().min(3).label("Customer support title"),
  });
  return editCusSupTitleVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Edit customer support subtitle validation.
const editCusSupSubTitleVal = (data) => {
  const editCusSupSubTitleVal = Joi.object().keys({
    custsupsubtitleid: Joi.string()
      .required()
      .label("Customer support sub title Id"),
    custsuptitleid: Joi.string().required().label("Customer support title Id"),
    subtitle: Joi.string().required().min(3).label("Customer support subtitle"),
    description: Joi.string().required().label("Customer support description"),
  });
  return editCusSupSubTitleVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// create service history validation.
const createServiceHisVal = (data) => {
  const createServiceHisVal = Joi.object().keys({
    serviceproviderid: Joi.string().required().label("Service provider Id"),
    customerid: Joi.string().required().label("Customer Id"),
    addresstype: Joi.string().required().valid("1", "2").label("Address type"),
    street: Joi.string().required().label("Address street"),
    area: Joi.string().required().label("Address area"),
    pincode: Joi.string().required().label("Address pincode"),
    name: Joi.string().required().label("Service provider name"),
    servicedate: Joi.string().required().label("service date"),
    sessiontype: Joi.string().required().valid("1", "2").label("Session type"),
    sessiontime: Joi.string().required().label("Session time"),
    servicestatus: Joi.string()
      .required()
      .valid("0", "1", "2", "3", "4", "5")
      .label("Service status type"),
  });
  return createServiceHisVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Edit service history validation.
const editServiceHisVal = (data) => {
  const editServiceHisVal = Joi.object().keys({
    servicehistoryid: Joi.string().required().label("Service history Id"),
    serviceproviderid: Joi.string().required().label("Service provider Id"),
    addresstype: Joi.string().required().valid("1", "2").label("Address type"),
    street: Joi.string().required().label("Address street"),
    area: Joi.string().required().label("Address area"),
    pincode: Joi.string().required().label("Address pincode"),
    name: Joi.string().required().label("Service provider name"),
    servicedate: Joi.string().required().label("Service date"),
    sessiontype: Joi.string().required().valid("1", "2").label("Session type"),
    sessiontime: Joi.string().required().label("Session time"),
  });
  return editServiceHisVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Change service status BY Service Provider validation.
const changeServiceStatusVal = (data) => {
  const changeServiceStatusVal = Joi.object().keys({
    servicehistoryid: Joi.string().required().label("Service history Id"),
    servicestatus: Joi.string()
      .required()
      .valid("0", "1", "2", "3", "4", "5")
      .label("Service status type"),
  });
  return changeServiceStatusVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Get customer owned service servicerating validation.
const getCusOwnedRateVal = (data) => {
  const getCusOwnedRateVal = Joi.object().keys({
    customerid: Joi.string().required().label("customer Id"),
  });
  return getCusOwnedRateVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Get customer owned service servicerating validation.
const chatReqStatusVal = (data) => {
  const chatReqStatusVal = Joi.object().keys({
    chatrequestid: Joi.string().required().label("Chat request Id"),
    chatstatus: Joi.number()
      .required()
      .valid(2, 3)
      .label("Chat request status"),
  });
  return chatReqStatusVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Change user password validation.
const createNewPasswordVal = (data) => {
  const createNewPasswordVal = Joi.object().keys({
    emailaddress: Joi.string().email().required().label("Email address"),
    newpassword: Joi.string().min(6).required().label("New password"),
    confirmpassword: Joi.any()
      .valid(Joi.ref("newpassword"))
      .required()
      .messages({ "any.only": "Confirm password does not match" })
      .label("Confirm password"),
  });
  return createNewPasswordVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

module.exports = {
  insertDataVal,
  verifyOtpVal,
  loginDataVal,
  updateProfileDataVal,
  changePasswordVal,
  resetPasswordVal,
  createServicesVal,
  editServicesVal,
  createSubServicesVal,
  editSubServicesVal,
  createSerProVal,
  editSerProVal,
  editTermsConditionVal,
  editCusSupTitleVal,
  editCusSupSubTitleVal,
  createServiceHisVal,
  editServiceHisVal,
  changeServiceStatusVal,
  getCusOwnedRateVal,
  chatReqStatusVal,
  createNewPasswordVal,
};
