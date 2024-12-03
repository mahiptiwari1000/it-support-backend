const express = require('express');
const multer = require('multer');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Configure multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all tickets for a specific user
router.get('/tickets', async (req, res) => {
  try {
    const { arNumber, userId, role } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!role) {
      return res.status(400).json({ error: 'User role is required' });
    }

    const query = {};
    if (role === 'ITStaff') {
      if (arNumber) {
        query.arNumber = new RegExp(arNumber, 'i'); // Partial match for arNumber
      }
    } else {
      query.userId = userId;
      if (arNumber) {
        query.arNumber = new RegExp(arNumber, 'i');
      }
    }

    const tickets = await Ticket.find(query);
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// POST a new ticket
router.post('/tickets', async (req, res) => {
  try {
    const {
      arNumber,
      userId,
      title,
      priority,
      severity,
      status,
      description,
      resolutionNotes,
      progressLog,
      product,
      subProduct,
    } = req.body;

    // Validate required fields
    if (!arNumber || !userId || !priority || !severity || !status || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare ticket data
    const ticketData = {
      title,
      userId,
      priority,
      severity,
      status,
      description,
      resolutionNotes,
      product,
      subProduct,
      dateUpdated: new Date(),
    };

    // Update ticket fields including progressLog
    const updatedTicket = await Ticket.findOneAndUpdate(
      { arNumber },
      {
        $set: ticketData,
        $push: { progressLog: progressLog ? `\n${progressLog}\n` : '' }, // Append progress log
      },
      { new: true, upsert: true }
    );

    res.status(201).json(updatedTicket);
  } catch (error) {
    console.error('Error creating or updating ticket:', error);
    res.status(500).json({ error: 'Failed to create or update ticket' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const {
      arNumber,
      severity,
      priority,
      status,
      startDate,
      endDate,
      product,
      subProduct,
      userId,
      role,
    } = req.query;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    const query = role === 'ITStaff' ? {} : { userId };

    if (arNumber) query.arNumber = new RegExp(arNumber, 'i');
    if (severity) query.severity = severity;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.dateCreated = {};
      if (startDate) query.dateCreated.$gte = new Date(startDate);
      if (endDate) query.dateCreated.$lte = new Date(endDate);
    }
    if (product) query.product = product;
    if (subProduct) query.subProduct = subProduct;

    const tickets = await Ticket.find(query);
    res.json(tickets);
  } catch (err) {
    console.error('Error searching tickets:', err);
    res.status(500).json({ error: 'Failed to search tickets' });
  }
});


// GET ticket details by userId or arNumber
// router.get('/ticketdetails', async (req, res) => {
//   try {
//     const { arNumber, userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ error: 'userId is required' });
//     }

//     const query = { userId };
//     if (arNumber) {
//       query.arNumber = arNumber;
//     }

//     const tickets = await TicketDetailsSchema.find(query).sort({ updatedAt: -1 });
//     if (!tickets.length) {
//       return res.status(404).json({ error: 'No tickets found' });
//     }

//     res.json(tickets[0]); // Return the most recent ticket
//   } catch (error) {
//     console.error('Error fetching ticket details:', error);
//     res.status(500).json({ error: 'Failed to fetch ticket details' });
//   }
// });

// // Middleware to validate progress logs
// const validateTicketDetails = (req, res, next) => {
//   try {
//     const { progressLog } = req.body;

//     if (progressLog) {
//       let parsedProgressLog;
//       if (typeof progressLog === 'string') {
//         parsedProgressLog = JSON.parse(progressLog);
//       } else if (Array.isArray(progressLog)) {
//         parsedProgressLog = progressLog;
//       } else {
//         throw new Error('progressLog must be a JSON array or stringified JSON array');
//       }

//       if (!Array.isArray(parsedProgressLog)) {
//         throw new Error('progressLog must be an array');
//       }

//       req.body.progressLog = parsedProgressLog; // Replace with parsed array
//     }
//     next();
//   } catch (error) {
//     console.error('Error validating progressLog:', error.message);
//     return res.status(400).json({ error: 'Invalid progressLog format' });
//   }
// };

// // POST new ticket details or update existing ticket
// router.post('/ticketdetails', upload.single('attachment'), validateTicketDetails, async (req, res) => {
//   try {
//     const {
//       arNumber,
//       priority,
//       severity,
//       status,
//       description,
//       progressLog,
//       resolutionNotes,
//       userId,
//     } = req.body;

//     if (!arNumber || !priority || !severity || !status || !userId) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const currentTimestamp = new Date().toLocaleString();

//     // Find and update the ticket
//     const updatedTicket = await TicketDetailsSchema.findOneAndUpdate(
//       { arNumber, userId },
//       {
//         $set: {
//           priority,
//           severity,
//           status,
//           resolutionNotes,
//         },
//         $push: { progressLog: { $each: progressLog } }, // Append new progress logs
//         $setOnInsert: { description }, // Set description only on insert
//       },
//       { new: true, upsert: true } // Create a new document if it doesn't exist
//     );

//     // Append new logs to the description field
//     updatedTicket.description += `\n${progressLog.map(log => `[${currentTimestamp}] ${log}`).join('\n')}`;
//     await updatedTicket.save();

//     res.status(200).json(updatedTicket);
//   } catch (error) {
//     console.error('Error creating or updating ticket details:', error);
//     res.status(500).json({ error: 'Failed to create or update ticket details' });
//   }
// });

module.exports = router;
