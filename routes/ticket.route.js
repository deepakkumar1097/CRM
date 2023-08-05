const ticketController = require("../controllers/ticket.controller");
const auth = require("../middlewares/auth.middleware");
const ticketValidator = require("../middlewares/ticket.middleware");

module.exports = function (app) {
  app.post(
    "/crm/api/v1/tickets",
    auth.verifyToken,
    ticketValidator.validateTicketReqBody,
    ticketController.createTicket
  );

  app.get("/crm/api/v1/tickets", auth.verifyToken, ticketController.getTickets);

  app.put("/crm/api/v1/tickets/:ticketId", auth.verifyToken, ticketController.updateTicket);
};
