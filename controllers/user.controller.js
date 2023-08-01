const User = require("../models/user.model");
const objectCoverter = require("../utils/objectConverter");

exports.findAll = async (req, res) => {
  const queryObj = {};

  const userType = req.query.userType;
  const userStatus = req.query.userStatus;

  if (userType) {
    queryObj.userType = userType;
  }

  if (userStatus) {
    queryObj.userStatus = userStatus;
  }

  const users = await User.find(queryObj);
  console.log(queryObj);

  res.status(200).send(objectCoverter.userResponse(users));
};

exports.update = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    /**
     * Find user which needs updation
     */
    if (!user) {
      return res.status(404).send({
        message: `User with the given ID ${req.params.id} is not found`,
      });
    }

    user.name = req.body.name != undefined ? req.body.name : user.name;
    user.userType =
      req.body.userType != undefined ? req.body.userType : user.userType;
    user.userStatus =
      req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;

    const updatedUser = await user.save();

    res.status(200).send({
      message: "User Updated SuccessFully",
      user: {
        name: updatedUser.name,
        userId: updatedUser.userId,
        email: updatedUser.email,
        userType: updatedUser.userType,
        userStatus: updatedUser.userStatus,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

// Create reset password and change userid
