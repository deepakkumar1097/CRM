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

isAdmin = async (req, res, next) => {
  const user = await userModel.findOne({ userId: req.userId });

  if (user && user.userType == constants.userType.admin) {
    next();
  } else {
    return res.status(403).send({
      message: `Only ${constants.userType.admin} are allowed`,
    });
  }
};

isAdminOrOwner = async (req, res, next) => {
  const user = await userModel.findOne({ userId: req.userId });

  if (user.userType == constants.userType.admin || user.userId == req.params.id) {
    if (req.body.userStatus && user.userType != constants.userType.admin) {
      return res.status(403).send({
        message: `Only ${constants.userType.admin} are allowed`,
      });
    }
    next();
  } else {
    return res.status(403).send({
      message: `Only ADMIN and OWNER are allowed to update the data`,
    });
  }
};

const authFunction = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrOwner: isAdminOrOwner,
};

module.exports = authFunction;
