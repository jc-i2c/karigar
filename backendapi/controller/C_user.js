const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/M_user");

const {
  insertDataVal,
  loginDataVal,
  verifyOtpVal,
  updateProfileDataVal,
  changePasswordVal,
  resetPasswordVal,
} = require("../helper/joivalidation");

const { sendOtp } = require("../helper/mailsending");

// User signup API.
const userSignUp = async (req, res, next) => {
  try {
    const { emailaddress, password, userroll } = req.body;

    // Joi validation.
    const { error } = insertDataVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        isSuccess: false,
        message: errorMsg,
      });
    } else {
      var genOtp = Math.floor(100000 + Math.random() * 900000);
      let data = {
        emailaddress: emailaddress,
        otp: genOtp,
        verification: true,
      };
      const mailResponse = await sendOtp(data);
      // const mailResponse = true;

      if (mailResponse) {
        var user = new User({
          emailaddress: emailaddress,
          password: password,
          otp: genOtp,
          userroll: userroll,
        });

        user.save((err, doc) => {
          if (!err) {
            return res.send({
              isSuccess: true,
              message: `OTP sending on your email address ${emailaddress}.Please verify otp.`,
            });
          } else {
            // console.log("Error during record insertion : " + err);
            return res.send({
              isSuccess: false,
              message: `Error during record insertion : + ${err}`,
            });
          }
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
        isSuccess: false,
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
                { id: findUser._id },
                process.env.TOKEN_KEY
              );
              return res.send({
                isSuccess: true,
                message: `User login successfully.`,
                token: token,
              });
            } else {
              return res.send({
                isSuccess: false,
                message: `You are not activated. Please contact to admin.`,
              });
            }
          } else {
            return res.send({
              isSuccess: false,
              message: `Wrong credentials.`,
            });
          }
        } else {
          return res.send({
            isSuccess: false,
            message: `User not verified. First, you need to verify your account.`,
          });
        }
      } else {
        return res.send({
          isSuccess: false,
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
        isSuccess: false,
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
              isSuccess: true,
              message: setMessage,
            });
          } else {
            return res.send({
              isSuccess: false,
              message: `User not verified. First, you need to verify your account.`,
            });
          }
        } else {
          return res.send({
            isSuccess: false,
            message: `Please enter valid data.`,
          });
        }
      } else {
        return res.send({
          isSuccess: false,
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
    const { name, gender, mobilenumber } = req.body;

    // Joi validation.
    const { error } = updateProfileDataVal(req.body);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        isSuccess: false,
        message: errorMsg,
      });
    } else {
      const updateQry = {
        name: name,
        gender: gender,
        mobilenumber: mobilenumber,
      };

      const result = await User.findByIdAndUpdate(userId, {
        $set: updateQry,
      });

      if (result) {
        return res.send({
          isSuccess: true,
          message: `User profile details updated.`,
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
        isSuccess: false,
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
            isSuccess: true,
            message: `Password change successfully.`,
          });
        } else {
          return res.send({
            isSuccess: false,
            message: `Password not change.`,
          });
        }
      } else {
        return res.send({
          isSuccess: false,
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
        isSuccess: false,
        message: errorMsg,
      });
    } else {
      const findUser = await User.findOne({ emailaddress: emailaddress });

      if (findUser) {
        if (findUser.status == 0 || findUser.status > 1) {
          return res.send({
            isSuccess: false,
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
                isSuccess: true,
                message: `OTP send on your email address.`,
              });
            } else {
              return res.send({
                isSuccess: false,
                message: `Password not change.`,
              });
            }
          } else {
            return res.send({
              isSuccess: false,
              message: `Mail send-in occurred in error.`,
            });
          }
        }
      } else {
        return res.send({
          isSuccess: false,
          message: `User not found into system.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// User active or deactive API.
const isActive = async (req, res, next) => {
  try {
    const userId = req.body.userid;

    if (userId == null) {
      return res.send({
        isSuccess: false,
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
              isSuccess: true,
              message: `User Deactivated.`,
            });
          } else {
            return res.send({
              isSuccess: false,
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
              isSuccess: true,
              message: `User Activated.`,
            });
          } else {
            return res.send({
              isSuccess: false,
              message: `Data not updated.`,
            });
          }
        }
      } else {
        return res.send({
          isSuccess: false,
          message: `User not found into system.`,
        });
      }
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
};
