const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const profileImageUpload = require('./routes/profileImageUpload'); // Profile image upload route

const app = express();

// Middleware
app.use(cors()); // Enables cross-origin requests
app.use(express.json()); // Parses incoming JSON requests

// MongoDB connection
mongoose.connect (process.env.MONGO_URI='mongodb+srv://salvin:salvin@collegeconnect.t7c2u.mongodb.net/CollegeConnectDB?retryWrites=true&w=majority&appName=CollegeConnect',
      
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/events', eventRoutes); // Event routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/users', profileImageUpload); // Profile image upload route

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({ error: err.message });
});

// Define the PORT and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
