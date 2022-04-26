const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/M_user");

const {
  signUpVal,
  loginDataVal,
  verifyOtpVal,
  updateProfileDataVal,
  changePasswordVal,
  resetPasswordVal,
  createNewPasswordVal,
} = require("../helper/joivalidation");

const { sendOtp } = require("../helper/mailsending");

// User signup API.
const userSignUp = async (req, res, next) => {
  try {
    const { emailaddress, password, userroll, name } = req.body;

    // Joi validation.
    const { error } = signUpVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      var genOtp = Math.floor(100000 + Math.random() * 900000);

      let data = {
        emailaddress: emailaddress,
        otp: genOtp,
        verification: true,
      };

      if (Object.keys(data).length >= 0) {
        if (userroll) {
          var user = new User({
            emailaddress: emailaddress,
            password: password,
            otp: genOtp,
            userroll: userroll,
          });
        } else {
          var user = new User({
            name: name,
            emailaddress: emailaddress,
            password: password,
            otp: genOtp,
            userroll: "626113fadf6c093c730a54fa", // default customer
          });
        }

        user.save(async (error, doc) => {
          if (!error) {
            // send mail.
            await sendOtp(data);

            return res.send({
              status: true,
              message: `OTP sending on your email address ${emailaddress}.`,
            });
          } else {
            let errorMsg = {};

            errorMsg.keys = Object.keys(error.keyPattern)[0];
            errorMsg = `${error.keyValue.emailaddress} is already exists into system.`;

            return res.send({
              status: false,
              message: errorMsg,
            });
          }
        });
      } else {
        return res.send({
          status: false,
          message: `Data is required for send mail.!`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// User signup API.
const userLogin = async (req, res, next) => {
  try {
    const { emailaddress, password } = req.body;

    // Joi validation.
    const { error } = loginDataVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      const findUser = await User.findOne({ emailaddress: emailaddress });
      if (findUser) {
        // Check verification status.
        if (findUser.status == 1) {
          // Compare password with database.
          const passVerify = await bcrypt.compare(password, findUser.password);

          if (passVerify) {
            if (findUser.isactive === true) {
              // Create token
              const token = jwt.sign(
                { id: findUser._id, userroll: findUser.userroll },
                process.env.TOKEN_KEY
              );
              return res.send({
                status: true,
                message: `User login successfully.`,
                token: token,
              });
            } else {
              return res.send({
                status: false,
                message: `You are not activated. Please contact to admin.`,
              });
            }
          } else {
            return res.send({
              status: false,
              message: `Wrong credentials.`,
            });
          }
        } else {
          return res.send({
            status: false,
            message: `User not verified. First, you need to verify your account.`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Wrong credentials.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Verify OTP API.
const verifyOtp = async (req, res, next) => {
  try {
    const { emailaddress, otp } = req.body;

    // Joi validation.
    const { error } = verifyOtpVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      const findUser = await User.findOne({ emailaddress: emailaddress });

      if (findUser) {
        if (otp == findUser.otp) {
          let updateQry = {},
            setMessage = "";
          // Check status is 1 or 0.
          if (findUser.status == true) {
            updateQry = { otp: "" };
            setMessage = `OTP verify successfully.`;
          } else {
            updateQry = {
              otp: "",
              status: true,
            };
            setMessage = `User verify successfully.`;
          }

          const result = await User.findByIdAndUpdate(findUser._id, {
            $set: updateQry,
          });
          if (result) {
            return res.send({
              status: true,
              message: setMessage,
            });
          } else {
            return res.send({
              status: false,
              message: `User not verified. First, you need to verify your account.`,
            });
          }
        } else {
          return res.send({
            status: false,
            message: `Please enter valid data.`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Please enter valid data.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Update user profile details API.
const updateProfile = async (req, res, next) => {
  try {
    const userId = res.user._id;
    const {
      name,
      gender,
      mobilenumber,
      // , location
    } = req.body;

    // Joi validation.
    const { error } = updateProfileDataVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      const updateQry = {
        name: name,
        gender: gender,
        mobilenumber: mobilenumber,
        // location: location,
      };

      const result = await User.findByIdAndUpdate(userId, {
        $set: updateQry,
      });

      if (result) {
        return res.send({
          status: true,
          message: `User profile details updated.`,
        });
      } else {
        return res.send({
          status: false,
          message: `User profile details not updated.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Change user password details API.
const changePassword = async (req, res, next) => {
  try {
    const userId = res.user._id;
    const { oldpassword, newpassword } = req.body;

    // Joi validation.
    const { error } = changePasswordVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      // Compare password with database.
      const passVerify = await bcrypt.compare(oldpassword, res.user.password);

      if (passVerify) {
        // Bcrypt password.
        bcryptPassword = await bcrypt.hash(newpassword, 12);

        // Update new password.
        const updateQry = {
          password: bcryptPassword,
        };

        const result = await User.findByIdAndUpdate(userId, {
          $set: updateQry,
        });

        if (result) {
          return res.send({
            status: true,
            message: `Password change successfully.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Password not change.`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Old password doesn't match.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Reset user password details API.
const resetPassword = async (req, res, next) => {
  try {
    const { emailaddress } = req.body;

    // Joi validation.
    const { error } = resetPasswordVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      const findUser = await User.findOne({ emailaddress: emailaddress });

      if (findUser) {
        if (findUser.status == 0 || findUser.status > 1) {
          return res.send({
            status: false,
            message: `User not verified. First, you need to verify your account.`,
          });
        } else {
          // Reset password.
          var genOtp = Math.floor(100000 + Math.random() * 900000);
          let data = {
            name: findUser.name,
            emailaddress: emailaddress,
            otp: genOtp,
            resetpassword: true,
          };
          const mailResponse = await sendOtp(data);

          if (mailResponse) {
            const result = await User.findByIdAndUpdate(findUser._id, {
              $set: { otp: genOtp },
            });

            if (result) {
              return res.send({
                status: true,
                message: `OTP send on your email address.`,
              });
            } else {
              return res.send({
                status: false,
                message: `Password not change.`,
              });
            }
          } else {
            return res.send({
              status: false,
              message: `Mail send-in occurred in error.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `User not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Create new password API (RESET).
const createNewPassword = async (req, res, next) => {
  const { emailaddress, newpassword, confirmpassword } = req.body;

  // Joi validation.
  const { error } = createNewPasswordVal(req.body);

  if (error) {
    let errorMsg = {};
    error.details.map(async (error) => {
      errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
    });

    return res.send({
      status: false,
      message: errorMsg,
    });
  } else {
    // Bcrypt password.
    bcryptPassword = await bcrypt.hash(newpassword, 12);

    const findUser = await User.findOne().where({ emailaddress: emailaddress });

    if (findUser) {
      // Update new password.
      const result = await User.findByIdAndUpdate(findUser._id, {
        $set: { password: bcryptPassword },
      });

      if (result) {
        return res.send({
          status: true,
          message: `Password change successfully.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Password not change.`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: `User not found into system.`,
      });
    }
  }
};

// User active or deactive API.
const isActive = async (req, res, next) => {
  try {
    const userId = req.body.userid;

    if (
      !userId ||
      userId == null ||
      userId == undefined ||
      userId == "null" ||
      userId == "undefined"
    ) {
      return res.send({
        status: false,
        message: `User Id is required.`,
      });
    } else {
      const findQry = await User.findById(userId);

      if (findQry) {
        if (findQry.isactive == true) {
          let isActive = { isactive: false };
          let updateQry = await User.findByIdAndUpdate(findQry._id, {
            $set: isActive,
          });
          if (updateQry) {
            return res.send({
              status: true,
              message: `User Deactivated.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Data not updated.`,
            });
          }
        } else if (findQry.isactive == false) {
          let isActive = { isactive: true };
          let updateQry = await User.findByIdAndUpdate(findQry._id, {
            $set: isActive,
          });
          if (updateQry) {
            return res.send({
              status: true,
              message: `User Activated.`,
            });
          } else {
            return res.send({
              status: false,
              message: `Data not updated.`,
            });
          }
        }
      } else {
        return res.send({
          status: false,
          message: `User not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get customer profile details API.
const profileDetails = async (req, res, next) => {
  try {
    let userprofiledetails = res.user;

    if (userprofiledetails) {
      let data = userprofiledetails.toObject();

      // Set user status verify or not.
      if (data.status) {
        data.status = "user_verified";
      } else {
        data.status = "user_not_verified";
      }

      // Set userroll.
      if (data.userroll == 1) {
        data.userroll = "admin";
      } else if (data.userroll == 2) {
        data.userroll = "service_provider";
      } else if (data.userroll == 3) {
        data.userroll = "customer";
      }

      // Set user is active or not.
      if (data.isactive) {
        data.isactive = "yes";
      } else {
        data.isactive = "no";
      }

      // Set user gender.
      if (data.gender == 1) {
        data.gender = "male";
      } else if (data.gender == 2) {
        data.gender = "female";
      }

      // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
      data.createdAt = data.createdAt
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");

      // updatedAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
      data.updatedAt = data.updatedAt
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");

      delete data.password; // delete data["password"]
      delete data.otp; // delete data["otp"]
      delete data.__v; // delete data["__v"]
      delete data.status; // delete data["status"]
      delete data.userroll; // delete data["userroll"]
      delete data.isactive; // delete data["isactive"]
      delete data.createdAt; // delete data["createdAt"]
      delete data.updatedAt; // delete data["updatedAt"]

      return res.send({
        status: true,
        message: `User profile details found into system.`,
        data: data,
      });
    } else {
      return res.send({
        status: false,
        message: `User profile details not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all users API.
const getAllUsers = async (req, res, next) => {
  try {
    let getQry = await User.find();

    if (getQry.length > 0 && getQry.length > -1) {
      let findData = [];
      let resData = {};
      getQry.forEach((data) => {
        resData = data.toObject();

        // Set user status verify or not.
        if (resData.status) {
          resData.status = "user_verified";
        } else {
          resData.status = "user_not_verified";
        }

        // Set userroll.
        if (resData.userroll == 1) {
          resData.userroll = "admin";
        } else if (resData.userroll == 2) {
          resData.userroll = "service_provider";
        } else if (resData.userroll == 3) {
          resData.userroll = "customer";
        }

        // Set user is active or not.
        if (resData.isactive) {
          resData.isactive = "yes";
        } else {
          resData.isactive = "no";
        }

        // Set user gender.
        if (resData.gender == 1) {
          resData.gender = "male";
        } else if (resData.gender == 2) {
          resData.gender = "female";
        }

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        // updatedAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.updatedAt = resData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        delete resData.password; // delete resData["password"]
        delete resData.otp; // delete resData["otp"]
        delete resData.__v; // delete resData["__v"]

        findData.push(resData);
      });

      return res.send({
        status: true,
        message: `${findData.length} User found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `No user found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Save user location API.
const saveLocation = async (req, res, next) => {
  try {
    let userdetails = res.user;
    let { location } = req.body;

    if (!location) {
      return res.send({
        status: false,
        message: `User location is required.`,
      });
    } else {
      const updateQry = {
        location: location,
      };

      const result = await User.findByIdAndUpdate(userdetails._id, {
        $set: updateQry,
      });

      if (result) {
        return res.send({
          status: true,
          message: `User location updated.`,
        });
      } else {
        return res.send({
          status: false,
          message: `User location not updated.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get user location API.
const getUserLocation = async (req, res, next) => {
  try {
    let userdetails = res.user;

    if (userdetails) {
      return res.send({
        status: true,
        message: `User location fount into system.`,
        userlocation: userdetails.location,
      });
    } else {
      return res.send({
        status: false,
        message: `User location not fount into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete user details API.
const deleteUser = async (req, res, next) => {
  try {
    let { userid } = req.body;

    if (!userid) {
      return res.send({
        status: false,
        message: `User Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await User.find({
        _id: {
          $in: userid,
        },
      });

      // console.log(findQry, "findQry");

      var totalUser = findQry.length;
      var cntUsers = 0;

      if (totalUser <= 0) {
        return res.send({
          status: true,
          message: `${cntUsers} services found into system.!`,
        });
      } else {
        // Array of all services.
        await Promise.all(
          findQry.map(async (usersList) => {
            cntUsers = cntUsers + 1;
            await User.findByIdAndDelete(usersList._id);
          })
        );

        if (totalUser == cntUsers) {
          return res.send({
            status: true,
            message: `${cntUsers} User deleted.!`,
          });
        } else if (cntUsers > 0) {
          return res.send({
            status: true,
            message: `User deleted ${cntUsers} out of ${totalUser} User.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalUser} User but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all customer API.
const getAllCustomer = async (req, res, next) => {
  try {
    let getQry = await User.find().where({
      userroll: "626113fadf6c093c730a54fa",
      isactive: true,
    });

    if (getQry.length > 0 && getQry.length > -1) {
      let findData = [];
      let resData = {};
      getQry.forEach((data) => {
        resData = data.toObject();

        // // Set user status verify or not.
        // if (resData.status) {
        //   resData.status = "user_verified";
        // } else {
        //   resData.status = "user_not_verified";
        // }

        // // Set userroll.
        // if (resData.userroll == 1) {
        //   resData.userroll = "admin";
        // } else if (resData.userroll == 2) {
        //   resData.userroll = "service_provider";
        // } else if (resData.userroll == 3) {
        //   resData.userroll = "customer";
        // }

        // // Set user is active or not.
        // if (resData.isactive) {
        //   resData.isactive = "yes";
        // } else {
        //   resData.isactive = "no";
        // }

        // Set user gender.
        if (resData.gender == 1) {
          resData.gender = "male";
        } else if (resData.gender == 2) {
          resData.gender = "female";
        }

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.createdAt = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        // updatedAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        resData.updatedAt = resData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        delete resData.userroll; // delete resData["password"]
        delete resData.password; // delete resData["password"]
        delete resData.otp; // delete resData["otp"]
        delete resData.__v; // delete resData["__v"]

        findData.push(resData);
      });

      return res.send({
        status: true,
        message: `${findData.length} customer found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `No customer found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  userSignUp,
  userLogin,
  verifyOtp,
  updateProfile,
  changePassword,
  resetPassword,
  isActive,
  createNewPassword,
  profileDetails,
  getAllUsers,
  saveLocation,
  getUserLocation,
  deleteUser,
  getAllCustomer,
};
