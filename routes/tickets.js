const express = require('express');
const multer = require('multer');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // Specify the folder for file uploads
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

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

    const tickets = await Ticket.find(query);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({ error: 'Failed to fetch ticket details' });
  }
});

// POST new ticket details
router.post('/ticketdetails', upload.single('attachment'), async (req, res) => {
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

    // Create a new ticket details object
    const newTicketDetails = new Ticket({
      arNumber,
      priority,
      severity,
      status,
      description,
      progressLog: progressLog ? JSON.parse(progressLog) : [], // Parse progressLog if provided
      resolutionNotes,
      userId,
      attachment: req.file ? req.file.path : null, // Save attachment file path
    });

    const savedTicketDetails = await newTicketDetails.save();
    res.status(201).json(savedTicketDetails);
  } catch (error) {
    console.error('Error creating ticket details:', error);
    res.status(500).json({ error: 'Failed to create ticket details' });
  }
});

module.exports = router;
