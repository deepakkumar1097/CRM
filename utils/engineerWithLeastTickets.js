const userModel = require("../models/user.model");

module.exports = async () => {
  /**
   * Find an engineer with approved status
   */
  const engineers = await userModel
    .find({
      userType: "ENGINEER",
      userStatus: "APPROVED",
    })
    .populate("ticketsAssigned");

  let engineerWithLeastTickets = engineers[0];

  for (const engineer of engineers) {
    if (engineer.userStatus === "PENDING") {
      engineerWithLeastTickets = engineer;
      s;
    } else if (
      engineer.userStatus === "APPROVED" &&
      engineer.ticketsAssigned.length <
        engineerWithLeastTickets.ticketsAssigned.length
    ) {
      engineerWithLeastTickets = engineer;
    }
  }

  return engineerWithLeastTickets;
};
