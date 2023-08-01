const User = require("../models/user.model");
const constants = require("../utils/constants");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

exports.signup = async (req, res) => {
  const hashedPass = bcrypt.hashSync(req.body.password, 10);
  console.log(hashedPass);

  var userStatus = req.body.userStatus;

  if (req.body.userType === constants.userType.customer) {
    userStatus = constants.userStatus.approved;
  } else if (userStatus && userStatus === constants.userStatus.approved) {
    userStatus = constants.userStatus.pending;
  } else {
    userStatus = constants.userStatus.pending;
  }

  const userObj = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    password: hashedPass,
    userType: req.body.userType,
    userStatus: userStatus,
  };

  try {
    const userCreated = await User.create(userObj);
    const postResponse = {
      name: userCreated.name,
      userId: userCreated.userId,
      email: userCreated.email,
      userType: userCreated.userType,
      userStatus: userCreated.userStatus,
      createdAt: userCreated.createdAt,
      userUpdatedAt: userCreated.updatedAt,
    };
    res.status(201).send(postResponse);
  } catch (err) {
    console.log(`Error while inserting user ${err}`);
    res.status(500).send({
      message: " Some Internal error while registation",
    });
  }
};

const validateLogin = async (userId, password) => {
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user.userStatus != constants.userStatus.approved) {
      return null;
    }

    if (isPasswordValid) {
      return user;
    } else {
      return null;
    }
  } catch (err) {
    throw new Error("Login validation failed");
  }
};

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await validateLogin(userId, password);

    const token = jwt.sign({ id: user.userId }, authConfig.secretKey, {
      expiresIn: 120,
    });

    if (user) {
      res.status(201).send({
        message: "Login successful",
        user: {
          name: user.name,
          userId: user.userId,
          email: user.email,
          userType: user.userType,
          userStatus: user.userStatus,
          accessToken: token,
        },
      });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.signin = async (req, res) => {
  const user = await User.findOne({ userId: req.body.userId });
  console.log(user);

  if (user == null) {
    return res.status(401).send({
      message: "User not exist",
    });
  }

  if (user.userStatus != constants.userStatus.approved) {
    return res.status(200).send({
      message: `Can't Login with ${user.userStatus} status`,
    });
  }
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign({ id: user.userId }, authConfig.secretKey, {
    expiresIn: 150000,
  });

  var responseUser = {
    name: user.name,
    userId: user.userId,
    email: user.email,
    userType: user.userType,
    userStatus: user.userStatus,
    accessToken: token,
  };

  res.status(200).send({
    message: "Login Successfully",
    user: responseUser,
  });
};
