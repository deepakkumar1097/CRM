const ticketModel = require("../models/ticket.model");
const userModel = require("../models/user.model");
const constants = require("../utils/constants");

exports.createTicket = async (req, res) => {
  try {
    // Create Ticket Object from req.body

    const reqObj = {
      title: req.body.title,
      ticketPriority: req.body.ticketPriority,
      description: req.body.description,
      status: req.body.status,
      reporter: req.userId,
    };

    /**
     * Find an engineer with approved status
     */

    const engineer = await userModel.findOne({
      userType: "ENGINEER",
      userStatus: "APPROVED",
    });

    if (engineer) {
      reqObj.assignee = engineer.userId;
    }

    const ticketCreated = await ticketModel.create(reqObj);

    if (ticketCreated) {
      const customer = await userModel.findOne({ userId: req.userId });
      customer.ticketsCreated.push(ticketCreated._id);

      await customer.save();

      if (engineer) {
        engineer.ticketsAssigned.push(ticketCreated._id);
        await engineer.save();
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
