const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const TicketSchema = require('../models/TicketSchema');

// GET all tickets for a specific user
router.get('/tickets', async (req, res) => {
    try {
      const { arNumber, userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      const query = { userId };
      if (arNumber) {
        query.arNumber = new RegExp(arNumber, 'i');
      }
      const tickets = await Ticket.find(query);
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
    console.log("calling this search api");
    
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
            userId
        } = req.query;
        
        if(!userId){
            return res.status(400).json({ error: 'userId is required' });
        }

        // Build the query object dynamically
        const query = {};
        query.userId = userId;
        // Filter by AR number (partial match, case-insensitive)
        if (arNumber) {
            query.arNumber = new RegExp(arNumber, 'i'); // Case-insensitive regex match
        }

        // Filter by severity
        if (severity) {
            query.severity = severity;
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        // Filter by requestor's username
        if (requestorUsername) {
            query.requestorUsername = new RegExp(requestorUsername, 'i'); // Case-insensitive regex match
        }

        // Filter by assignee's username
        if (assigneeUsername) {
            query.assigneeUsername = new RegExp(assigneeUsername, 'i'); // Case-insensitive regex match
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.dateCreated = {};
            if (startDate) {
                query.dateCreated.$gte = new Date(startDate); // Greater than or equal to startDate
            }
            if (endDate) {
                query.dateCreated.$lte = new Date(endDate); // Less than or equal to endDate
            }
        }

        // Filter by product
        if (product) {
            query.product = product;
        }

        // Filter by sub-product
        if (subProduct) {
            query.subProduct = subProduct;
        }
        
        // Fetch tickets from the database based on the query
        const tickets = await Ticket.find(query);

        res.json(tickets);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});


router.post('/ticketdetails', async (req, res) => {
    try {
      const {
        arNumber,
        title,
        description,
        emailAddress,
        fullName,
        severity,
        priority,
        product,
        subProduct,
        status,
        assignee,
        assigneeEmail,
        userId,
        resolutionNotes,
        role, // Assuming role is sent in the request body to determine if the user is ITStaff
      } = req.body;
  
      // Validate mandatory fields
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
      }
      if (!arNumber || !title || !description || !emailAddress || !fullName || !severity || !priority || !product || !subProduct || !status || !assignee || !assigneeEmail) {
        return res.status(400).json({ error: 'All mandatory fields are required' });
      }
  
      // Conditionally include resolutionNotes based on role
      const ticketData = {
        arNumber,
        title,
        description,
        emailAddress,
        fullName,
        severity,
        priority,
        product,
        subProduct,
        status,
        assignee,
        assigneeEmail,
        userId,
      };
  
      if (role === 'ITStaff' && resolutionNotes) {
        ticketData.resolutionNotes = resolutionNotes; // Only allow resolutionNotes for ITStaff
      }
  
      // Create a new ticket instance
      const newTicket = new TicketSchema(ticketData);
      const savedTicket = await newTicket.save();
  
      // Respond with the saved ticket
      res.status(201).json(savedTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  });      

module.exports = router;
