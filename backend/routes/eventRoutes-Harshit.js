const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const authMiddleware = require('../middleware/authMiddleware');

// Create an event (coordinator only)
router.post('/create', authMiddleware(['coordinator']), async (req, res) => {
    const { title, description, date, time, location, clubName, eventType, numParticipants, department, rules, image } = req.body;
    
    try {
        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            clubName,
            eventType,
            numParticipants: eventType === 'Group' ? numParticipants : 1,
            department,
            rules,
            image,
            createdBy: req.user.name
        });
        
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: 'Error creating event: ' + error.message });
    }
});

module.exports = router;
