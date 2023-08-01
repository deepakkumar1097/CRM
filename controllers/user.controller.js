const User = require("../models/user.model");
const objectCoverter = require("../utils/objectConverter");

exports.findAll = async (req, res) => {
  //console.log(req.userId);

  //const user1 = await User.find({ userId: req.userId });
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

// exports.update = async (req, res) => {
//   const user = await User.findOne({ userId: req.params.id });

//   if (!user) {
//     return res.status(404).send({
//       message: `User with the given ID ${req.params.id} is not`,
//     });
//   }

//    user.
// };
