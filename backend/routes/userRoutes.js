const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, role, class: classInfo, department, registerNumber, clubName, phoneNumber } = req.body;

    try {
        // Create a new user object based on the role
        const userData = { name, email, password, role, department, phoneNumber };

        if (role === 'student') {
            userData.class = classInfo;
            userData.registerNumber = registerNumber;
        } else if (role === 'coordinator') {
            userData.clubName = clubName;
        }

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user: { _id: user._id, email: user.email, role: user.role } }); // Return necessary user details

    } catch (err) {
        res.status(400).json({ error: "An error occurred during login" });
    }
});

// Profile route (protected)
router.get('/profile', authMiddleware(['student', 'coordinator']), (req, res) => {
    try {
        // Fetch the user's profile
        res.json({ message: `Hello ${req.user.role}`, user: req.user });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

module.exports = router;
