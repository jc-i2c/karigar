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
    userroll: Joi.string()
      .length(1)
      .valid("1", "2", "3")
      .required()
      .label("User roll"),
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
const craeteServicesVal = (data) => {
  const craeteServicesVal = Joi.object().keys({
    servicename: Joi.string().required().min(3).label("Service name"),
  });
  return craeteServicesVal.validate(data, {
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
  const craeteServicesVal = Joi.object().keys({
    servicesid: Joi.string().required().label("Service Id"),
    servicename: Joi.string().required().min(3).label("Service name"),
  });
  return craeteServicesVal.validate(data, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  });
};

// Create sub services validation.
const craeteSubServicesVal = (data) => {
  const craeteSubServicesVal = Joi.object().keys({
    servicesid: Joi.string().required().label("Service Id"),
    subservicename: Joi.string().required().min(3).label("Sub service name"),
  });
  return craeteSubServicesVal.validate(data, {
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

module.exports = {
  insertDataVal,
  verifyOtpVal,
  loginDataVal,
  updateProfileDataVal,
  changePasswordVal,
  resetPasswordVal,
  craeteServicesVal,
  editServicesVal,
  craeteSubServicesVal,
  editSubServicesVal,
  createSerProVal,
  editSerProVal,
};
