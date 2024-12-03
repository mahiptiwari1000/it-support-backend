const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    arNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    product: {
      type: String,
      required: true,
    },
    subProduct: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Assigned',
    },
    progressLog: [
      {
        message: { type: String, required: true }, // Log message
        timestamp: { type: Date, required: true }, // When the log was created
      },
    ],
    resolutionNotes: {
      type: String,
      default: '',
    },
    attachment: {
      data: Buffer,
      contentType: String,
    },
    assignee: {
      type: String,
      default: '',
    },
    assigneeEmail: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);
