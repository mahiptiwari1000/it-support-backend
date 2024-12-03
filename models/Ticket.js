const mongoose = require('mongoose');

const namesList = ['Mahip', 'Hansika'];

// Step 2: Function to select a random name
function getRandomName() {
  const randomIndex = Math.floor(Math.random() * namesList.length);
  return namesList[randomIndex];
}


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
    statusChangeTimestamp: {
      type: Date,
      default: Date.now, // Automatically set the timestamp when the document is created
    },
    progressLog: {
      type: String,
      default: '',
    },    
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);
