const mongoose = require('mongoose');

// Define the TicketDetail schema
const ticketDetailSchema = new mongoose.Schema({
  arNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  emailAddress: { type: String, required: true },
  fullName: { type: String, required: true },
  severity: { type: String, required: true },
  priority: { type: String, required: true },
  product: { type: String, required: true },
  subProduct: { type: String, required: true },
  status: { type: String, required: true },
  assignee: { type: String, required: true },
  assigneeEmail: { type: String, required: true },
  userId: { type: String, required: true },
  resolutionNotes: { type: String, default: '' },
  progressLogs: [
    {
      timestamp: { type: Date, default: Date.now },
      change: { type: String, required: true },
    },
  ],
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TicketDetail', ticketDetailSchema);
