const jwt = require("jsonwebtoken");
const User = require("../models/M_user");

const config = process.env;

const verifyUserRoll = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      const decoded = jwt.verify(bearerToken, config.TOKEN_KEY);

      // Find user.
      req.userid = decoded.id;

      const findUser = await User.findById(req.userid).select("userroll");
      if (findUser) {
        if (findUser.userroll == 1) next();
        else {
          return res.send({
            isSuccess: false,
            message: `Your not authorized users.`,
          });
        }
      } else {
        return res.send({
          isSuccess: false,
          message: "Invalid Token.",
        });
      }
    } else {
      return res.send({
        isSuccess: false,
        message: "A token is required for authentication.",
      });
    }
  } catch (error) {
    return res.send({
      isSuccess: false,
      message: "Invalid Token.",
    });
  }
};

module.exports = verifyUserRoll;
