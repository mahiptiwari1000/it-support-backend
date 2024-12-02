const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ticketRoutes = require('./routes/tickets');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Define the base URL dynamically based on the environment
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors({
    origin: 'https://main.d3auyg61sr8gu7.amplifyapp.com', // Allow requests from the Amplify app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Include credentials (if needed)
  }));
app.use(express.json());

// Use ticket routes
app.use('/api', ticketRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a route to handle GET requests to the root URL
app.get('/', (req, res) => {
  res.send(`Welcome to the IT Support App Backend! Running at ${BASE_URL}`);
});

// Commenting the listen part for deployment on vercel
// app.listen(PORT, () => {
//   console.log(`Server running on ${BASE_URL}`);
// });


// Commenting the export part for testing on development environment
module.exports = app;