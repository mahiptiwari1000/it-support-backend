// models/Ticket.js

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  arNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  emailAddress: {type: String, required: true},
  fullName: {type: String, required: true},
  severity: { type: String, required: true },
  priority: { type: String, required: true },
  product: { type: String, required: true },
  subProduct: { type: String, required: true },
  status: { type: String, required: true },
  assignee: { type: String, required: true },
  assigneeEmail: { type: String, required: true },
  userId: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
