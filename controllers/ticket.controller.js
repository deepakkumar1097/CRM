const ticketModel = require("../models/ticket.model");
const userModel = require("../models/user.model");
const constants = require("../utils/constants");

async function findEngineerWithLeastTickets() {
  const engineers = await userModel
    .find({
      userType: "ENGINEER",
      userStatus: "APPROVED",
    })
    .populate("ticketsAssigned");

  let engineerWithLeastTickets = engineers[0];

  for (const engineer of engineers) {
    if (
      engineer.ticketsAssigned.length <
      engineerWithLeastTickets.ticketsAssigned.length
    ) {
      engineerWithLeastTickets = engineer;
    }
  }

  return engineerWithLeastTickets;
}

exports.createTicket = async (req, res) => {
  try {
    // Create Ticket Object from req.body

    const reqObj = {
      ticketId: constants.ticketID.prefix + Date.now(),
      title: req.body.title,
      ticketPriority: req.body.ticketPriority,
      description: req.body.description,
      status: req.body.status,
      reporter: req.userId,
    };

    /**
     * Find an engineer with approved status
     */

    const engineerWithLeastTickets = await findEngineerWithLeastTickets();

    if (engineerWithLeastTickets) {
      reqObj.assignee = engineerWithLeastTickets.userId;
    }

    const ticketCreated = await ticketModel.create(reqObj);

    if (ticketCreated) {
      const customer = await userModel.findOne({ userId: req.userId });
      customer.ticketsCreated.push(ticketCreated._id);

      await customer.save();

      if (engineerWithLeastTickets) {
        engineerWithLeastTickets.ticketsAssigned.push(ticketCreated._id);
        await engineerWithLeastTickets.save();
      }
    }

    res.status(201).send(ticketCreated);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error while creating ticket",
    });
  }
};

// exports.createTicket = async (req, res) => {
//   try {
//     // Create Ticket Object from req.body

//     const reqObj = {
//       title: req.body.title,
//       ticketPriority: req.body.ticketPriority,
//       description: req.body.description,
//       status: req.body.status,
//       reporter: req.userId,
//     };

//     /**
//      * Find an engineer with approved status
//      */

//     const engineer = await userModel.findOne({
//       userType: "ENGINEER",
//       userStatus: "APPROVED",
//     });

//     if (engineer) {
//       reqObj.assignee = engineer.userId;
//     }

//     const ticketCreated = await ticketModel.create(reqObj);

//     if (ticketCreated) {
//       const customer = await userModel.findOne({ userId: req.userId });
//       customer.ticketsCreated.push(ticketCreated._id);

//       await customer.save();

//       if (engineer) {
//         engineer.ticketsAssigned.push(ticketCreated._id);
//         await engineer.save();
//       }
//     }

//     res.status(201).send(ticketCreated);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       message: "Error while creating ticket",
//     });
//   }
// };

// exports.getTickets = async (req, res) => {
//   try {
//     // If Engineer => get all the tickets which are assigned to him/her
//     // If Customer => get all the tickets which are created by him/her
//     // If Admin => get all the tickets

//     const queryObj = {};

//     const userType = req.query.userType;
//     // const ticketStatus = req.query.ticketStatus;

//     /**
//      * Fetch the calling users details
//      */

//     const user = await userModel.findOne({ userId: req.userId });

//     // user[0].ticketsAssigned.map((e) => {
//     //   console.log(e);
//     // });

//     if (user.userType === "CUSTOMER") {
//       queryObj.reporter = req.userId;
//     } else if (user.userType === "ENGINEER") {
//       queryObj.assignee = req.userId;
//     }

//     const tickets = await ticketModel.find(queryObj);
//     res.status(200).send(tickets);
//   } catch (err) {
//     res.status(500).send({
//       message: "Error while creating ticket",
//     });
//   }
// };

exports.getTickets = async (req, res) => {
  try {
    // If Engineer => get all the tickets which are assigned to him/her
    // If Customer => get all the tickets which are created by him/her
    // If Admin => get all the tickets

    const queryObj = {};

    const assignee = req.query.assignee;
    const status = req.query.status;

    if (assignee) {
      queryObj.assignee = assignee;
    }

    if (status) {
      queryObj.status = status;
    }
    
    const tickets = await ticketModel.find(queryObj);
    res.status(200).send(tickets);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error while creating ticket",
    });
  }
};

// create update ticket

exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const updatedTicket = req.body;

    // Find the ticket by its ID
    const ticket = await ticketModel.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update the ticket properties with the new values
    ticket.title = updatedTicket.title;
    ticket.ticketPriority = updatedTicket.ticketPriority;
    ticket.description = updatedTicket.description;
    ticket.status = updatedTicket.status;

    // Save the updated ticket
    const updatedTicketData = await ticket.save();

    res.status(200).json(updatedTicketData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating ticket" });
  }
};
