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
  // try using findOneandUpdate

  try {
    // Check if the required fields are provided in the request body
    // if (!req.body.name || !req.body.userType || !req.body.userStatus) {
    //   return res.status(400).send({
    //     message: "Name, userType, and userStatus are required fields",
    //   });
    // }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.id }, // Filter criteria to find the user to update
      {
        $set: {
          name: req.body.name,
          userType: req.body.userType,
          userStatus: req.body.userStatus,
          // Add other fields to update if needed
        },
      },
      { new: true } // Return the updated user instead of the old one
    );

    //const user = await User.findOne({ userId: req.params.id });
    /**
     * Find user which needs updation
     */
    if (!updatedUser) {
      return res.status(404).send({
        message: `User with the given ID ${req.params.id} is not found`,
      });
    }

    // user.name = req.body.name != undefined ? req.body.name : user.name;
    // user.userType =
    //   req.body.userType != undefined ? req.body.userType : user.userType;
    // user.userStatus =
    //   req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;

    updatedUser.name =
      req.body.name != undefined ? req.body.name : updatedUser.name;
    updatedUser.userType =
      req.body.userType != undefined ? req.body.userType : updatedUser.userType;
    updatedUser.userStatus =
      req.body.userStatus != undefined
        ? req.body.userStatus
        : updatedUser.userStatus;
    //const updatedUser = await user.save();

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
