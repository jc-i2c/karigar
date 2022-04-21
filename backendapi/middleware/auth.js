const jwt = require("jsonwebtoken");
const User = require("../models/M_user");

const config = process.env;

const verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      const decoded = jwt.verify(bearerToken, config.TOKEN_KEY);

      // Find user.
      req.userid = decoded.id;

      const findUser = await User.findById(req.userid);

      if (findUser) {
        if (findUser.status) res.user = findUser;
        else {
          return res.send({
            status: false,
            message: `User not verified. First, you need to verify your account.`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: "Invalid Token.",
        });
      }

      next();
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

module.exports = verifyToken;
