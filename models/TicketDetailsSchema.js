const mongoose = require('mongoose');

const ticketDetailsSchema = new mongoose.Schema({
  arNumber: { type: String, required: true },
  priority: { type: String, required: true }, // Now required
  severity: { type: String, required: true }, // Now required
  status: { type: String, required: true, default: 'Assigned' }, // Default to "Assigned"
  description: { type: String, required: false },
  attachment: { type: String, required: false }, // Path or metadata for the attached file
  progressLog: { type: [String], required: false }, // Array of progress log entries
  resolutionNotes: { type: String, required: false }, // Optional resolution notes
  userId: { type: String, required: true }, // User ID (already exists)
  dateCreated: { type: Date, default: Date.now }, // Creation date
});

module.exports = mongoose.model('TicketDetails', ticketDetailsSchema);
