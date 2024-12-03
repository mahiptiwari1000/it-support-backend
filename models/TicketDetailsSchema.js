const mongoose = require('mongoose');

const TicketDetailsSchema = new mongoose.Schema({
  arNumber: { type: String, required: true },
  priority: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, default: 'Assigned' }, // Default status
  description: { type: String, required: true },
  progressLog: { type: Array, default: [] },
  resolutionNotes: { type: String, default: '' },
  userId: { type: String, required: true },
  attachment: { type: Buffer, default: null },
  attachmentType: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('TicketDetails', TicketDetailsSchema);
