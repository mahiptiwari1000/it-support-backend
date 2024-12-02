// models/Ticket.js

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  arNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  severity: { type: String, required: false },
  priority: { type: String, required: false },
  product: { type: String, required: false },
  subProduct: { type: String, required: true },
  status: { type: String, required: false },
  assignee: { type: String, required: false },
  assigneeEmail: { type: String, required: false },
  userId: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
