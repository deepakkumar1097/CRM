const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  ticketPriority: {
    type: String,
    required: true,
    default: 4,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
    default: "OPEN",
  },

  reporter: {
    type: String,
  },

  assignee: {
    type: String,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },

  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
