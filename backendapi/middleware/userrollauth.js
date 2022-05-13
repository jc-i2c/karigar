const jwt = require("jsonwebtoken");
const User = require("../models/M_user");

const config = process.env;

const userRoleAuth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      const decoded = jwt.verify(bearerToken, config.TOKEN_KEY);

      // Find user.
      req.userid = decoded.id;
      req.roletag = decoded.roletag;

      const findUser = await User.findById(req.userid).select("userroll");
      // let adminUser = findUser.userroll.toString();
      // console.log(decoded.roletag, "decoded.roletag");

      if (findUser) {
        if (decoded.roletag === "ADMIN") {
          next();
        } else {
          return res.send({
            status: false,
            message: `Your not authorized users.`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: "Invalid Token.",
        });
      }
    } else {
      return res.send({
        status: false,
        message: "A token is required for authentication.",
      });
    }
  } catch (error) {
    return res.send({
      status: false,
      message: "Invalid Token.",
    });
  }
};

module.exports = userRoleAuth;
