const mongoose = require('mongoose');

const TicketDetailsSchema = new mongoose.Schema(
  {
    arNumber: String,
    userId: String,
    status: String,
    priority: String,
    severity: String,
    description: String,
    progressLog: [String],
    resolutionNotes: String,
    attachment: Buffer,
    attachmentType: String,
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('TicketDetails', TicketDetailsSchema);
