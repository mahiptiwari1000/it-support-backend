const express = require('express');
const multer = require('multer');
const router = express.Router();
const Ticket = require('../models/Ticket');
const TicketDetailsSchema = require('..models/TicketDetails');

// Configure multer to store file in memory
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({ storage });

// GET all tickets for a specific user
router.get('/tickets', async (req, res) => {
  try {
    const { arNumber, userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = { userId: userId };

    if (arNumber) {
      query.arNumber = new RegExp(arNumber, 'i');
    }
    const tickets = await Ticket.find(query);
    console.log(tickets, 'tickets');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// POST a new ticket
router.post('/tickets', async (req, res) => {
  try {
    const ticketData = req.body;
    const newTicket = new Ticket(ticketData);
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// GET all tickets or search by arNumber
router.get('/search', async (req, res) => {
  console.log('calling this search API');

  try {
    const {
      arNumber,
      severity,
      priority,
      requestorUsername,
      assigneeUsername,
      status,
      startDate,
      endDate,
      product,
      subProduct,
      userId,
    } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Build the query object dynamically
    const query = {};
    query.userId = userId;

    if (arNumber) {
      query.arNumber = new RegExp(arNumber, 'i'); // Case-insensitive regex match
    }
    if (severity) {
      query.severity = severity;
    }
    if (priority) {
      query.priority = priority;
    }
    if (requestorUsername) {
      query.requestorUsername = new RegExp(requestorUsername, 'i'); // Case-insensitive regex match
    }
    if (assigneeUsername) {
      query.assigneeUsername = new RegExp(assigneeUsername, 'i'); // Case-insensitive regex match
    }
    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.dateCreated = {};
      if (startDate) {
        query.dateCreated.$gte = new Date(startDate);
      }
      if (endDate) {
        query.dateCreated.$lte = new Date(endDate);
      }
    }
    if (product) {
      query.product = product;
    }
    if (subProduct) {
      query.subProduct = subProduct;
    }

    const tickets = await Ticket.find(query);
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET ticket details by userId or arNumber
router.get('/ticketdetails', async (req, res) => {
  try {
    const { arNumber, userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = { userId };

    if (arNumber) {
      query.arNumber = new RegExp(arNumber, 'i'); // Case-insensitive search for arNumber
    }

    const tickets = await TicketDetailsSchema.find(query);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({ error: 'Failed to fetch ticket details' });
  }
});

const validateTicketDetails = (req, res, next) => {
    try {
      const { progressLog } = req.body;
  
      // Log the raw progressLog for debugging
      console.log('Raw progressLog:', progressLog);
  
      // Validate progressLog
      if (progressLog) {
        let parsedProgressLog;
  
        // Parse if it's a string, or verify if it's an array
        if (typeof progressLog === 'string') {
          parsedProgressLog = JSON.parse(progressLog);
        } else if (Array.isArray(progressLog)) {
          parsedProgressLog = progressLog;
        } else {
          throw new Error('progressLog must be a JSON array or stringified JSON array');
        }
  
        // Ensure parsed progressLog is an array
        if (!Array.isArray(parsedProgressLog)) {
          throw new Error('progressLog must be an array');
        }
  
        req.body.progressLog = parsedProgressLog; // Replace with parsed array
      }
      next();
    } catch (error) {
      console.error('Error validating progressLog:', error.message);
      return res.status(400).json({ error: 'Invalid progressLog format' });
    }
  };
  

// POST new ticket details with file saved directly to MongoDB
router.post('/ticketdetails', upload.single('attachment'), validateTicketDetails, async (req, res) => {
    try {
      const {
        arNumber,
        priority,
        severity,
        status,
        description,
        progressLog,
        resolutionNotes,
        userId,
      } = req.body;
  
      // Validate required fields
      if (!arNumber || !priority || !severity || !status || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Log validated progressLog
      console.log('Validated progressLog:', progressLog);
  
      // Create a new ticket details object
      const newTicketDetails = new TicketDetailsSchema({
        arNumber,
        priority,
        severity,
        status,
        description,
        progressLog,
        resolutionNotes,
        userId,
        attachment: req.file ? req.file.buffer : null, // Save file as Buffer
        attachmentType: req.file ? req.file.mimetype : null, // Save file type for retrieval
      });
  
      const savedTicketDetails = await newTicketDetails.save();
      res.status(201).json(savedTicketDetails);
    } catch (error) {
      console.error('Error creating ticket details:', error);
      res.status(500).json({ error: 'Failed to create ticket details' });
    }
  });
    

module.exports = router;
