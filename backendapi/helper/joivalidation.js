const Joi = require("joi");

// Insert new user record validation.
const signUpVal = (data) => {
  const signUpVal = Joi.object().keys({
    name: Joi.string().required().label("Name"),
    emailaddress: Joi.string().email().required().label("Email address"),
    password: Joi.string().min(6).required().label("Password"),
    confirmpassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Confirm password does not match" })
      .label("Confirm password"),
  });
  return signUpVal.validate(data, {
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
    customer_key: Joi.allow(),
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
    mobilenumber: Joi.string().length(10).required().label("Mobile number"),
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
    servicedetails: Joi.allow().label("Service details"),
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
    userid: Joi.string().required().label("User Id"),
    subserviceid: Joi.string().required().label("Sub service Id"),
    price: Joi.number().required().label("Price"),
    servicedetails: Joi.allow().label("Service details"),
    image: Joi.string().required().label("Image"),
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
    address: Joi.string().required().label("Address"),
    name: Joi.string().required().label("Service provider name"),
    servicedate: Joi.string().required().label("service date"),
    bookingdate: Joi.string().required().label("Booking date"),
    // servicestatus: Joi.number()
    //   .required()
    //   .valid(0, 1, 2, 3, 4)
    //   .label("Service status type"),
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
    address: Joi.string().required().label("Address"),
    name: Joi.string().required().label("Service provider name"),
    servicedate: Joi.string().required().label("Service date"),
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
    servicestatus: Joi.number()
      .required()
      .valid(0, 1, 2, 3, 4)
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

const updateOfferVal = (data) => {
  const updateOfferVal = Joi.object().keys({
    offerid: Joi.string().required().label("Offer Id"),
    subserviceid: Joi.string().required().label("Sub service Id"),
    serviceproviderid: Joi.string().required().label("Service provider Id"),
    currentprice: Joi.number().required().label("Current price"),
    // actualprice: Joi.string().required().label("Actual price"),
  });
  return updateOfferVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create Banner validation.
const createBannerVal = (data) => {
  const createBannerVal = Joi.object().keys({
    bannertitle: Joi.string().required().min(3).label("Banner title"),
    bannersubtitle: Joi.string().required().min(3).label("Banner subtitle"),
    bannerimage: Joi.string().required().label("Banner image"),
  });
  return createBannerVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create Banner validation.
const updateBannerVal = (data) => {
  const updateBannerVal = Joi.object().keys({
    bannerid: Joi.string().required().label("Banner Id"),
    bannertitle: Joi.string().required().min(3).label("Banner title"),
    bannersubtitle: Joi.string().required().min(3).label("Banner subtitle"),
  });
  return updateBannerVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Admin update user data validation.
const adminUpdateUserDataVal = (data) => {
  const adminUpdateUserDataVal = Joi.object().keys({
    userid: Joi.string().required().label("User Id"),
    emailaddress: Joi.string().email().required().label("Email address"),
    name: Joi.string().min(3).required().label("Name"),
    userroll: Joi.string().required().label("Userrole"),
    mobilenumber: Joi.string().length(10).required().label("Mobile number"),
    gender: Joi.string().length(1).required().label("Gender"),
    profile_picture: Joi.allow().label("Profile picture"),
  });
  return adminUpdateUserDataVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

module.exports = {
  signUpVal,
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
  updateOfferVal,
  createBannerVal,
  updateBannerVal,
  adminUpdateUserDataVal,
};
