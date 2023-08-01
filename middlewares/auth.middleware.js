const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const userModel = require("../models/user.model");
const constants = require("../utils/constants");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  console.log(token);

  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    });
  }

  jwt.verify(token, config.secretKey, (err, payload) => {
    console.log(err);
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    console.log(payload);

    req.userId = payload.id;
    next();
  });
};

// isAdmin = async (req, res, next) => {
//   const user = await userModel.findOne({ userId: req.userId });

//   if (user && user.userType == constants.userType.customer) {
//     next();
//   } else {
//     return res.status(403).send({
//       message: `Only ${constants.userType.customer} are allowed`,
//     });
//   }
// };

const authFunction = {
  verifyToken: verifyToken,
  // isAdmin: isAdmin,
};

module.exports = authFunction;
