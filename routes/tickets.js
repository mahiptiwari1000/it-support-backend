const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

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
    try {
      const { arNumber, userId } = req.query;
      const query = { arNumber: new RegExp(arNumber, 'i'), userId: userId };
      const tickets = await Ticket.find(query);
      console.log(tickets, " filtered tickets");
      
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  });
    

module.exports = router;
