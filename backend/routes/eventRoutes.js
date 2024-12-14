const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const User = require('../models/userModel');
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
            createdBy: req.user._id
        });

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: 'Error creating event: ' + error.message });
    }
});

// Get all events (coordinator and student)
router.get('/', authMiddleware(['student', 'coordinator']), async (req, res) => {
    try {
        const events = await Event.find().sort({_id:-1});
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});
// Edit an event (coordinator only)
router.put('/edit/:id', authMiddleware(['coordinator']), async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
});

// Delete an event (coordinator only)
router.delete('/delete/:id', authMiddleware(['coordinator']), async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Event deleted' });
});

// Register for an event (student only)
// Route to register for an event
router.post('/:id/register', authMiddleware(['student']), async (req, res) => {
  const { id } = req.params; // Event ID from the URL
  const { registerNumbers } = req.body; // Participant register numbers from the request body

  try {
    // Validate register numbers
    if (!registerNumbers || registerNumbers.length === 0) {
      return res.status(400).json({ message: 'Please provide valid register numbers.' });
    }

    // Find the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Add the registration information to the event
    const newRegistration = {
      registerNumbers: registerNumbers, // Array of participant register numbers
      user: req.user.id, // Assuming authMiddleware sets req.user with the authenticated user's data
    };

    // Add the new registration to the event's registrations array
    event.registrations.push(newRegistration);

    // Save the updated event
    await event.save();

    res.status(200).json({ message: 'Registration successful!', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events
router.get('/', authMiddleware(['student', 'coordinator']), async (req, res) => {
    const events = await Event.find().sort({_id: -1}).populate('participants');
    res.json(events);
});

// Get Events Created by the Logged-in Coordinator
router.get('/createdByMe', authMiddleware(['coordinator']), async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id }).sort({_id:-1});
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get event details by ID (coordinator and student)
router.get('/details/:id', authMiddleware(['student', 'coordinator']), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id); // Find event by ID
        if (!event) return res.status(404).json({ error: 'Event not found' }); // Error if not found
        res.json(event); // Return event details
    } catch (error) {
        res.status(500).json({ error: 'Error fetching event details in /:id: ' + error.message });
    }
});

// Get events the user has registered for
router.get('/myevents', authMiddleware(['student']), async (req, res) => {
    
    try {
      // Find events where the logged-in user is in the registrations
      const events = await Event.find({ 'registrations.user' : req.user._id }).sort({_id:-1});
      
      if (events.length === 0) {
        return res.status(404).json({ message: 'No events found for this user.' });
      }

      res.json(events);
    } catch (error) {
      console.error('Error fetching user events:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get participants of a specific event (coordinator only)
router.get('/:id/participants', authMiddleware(['coordinator']), async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ error: 'Event not found' });

      // Extract the register numbers from registrations
      const registrations = event.registrations;

      // Fetch users for all register numbers
      const participantsData = await Promise.all(registrations.map(async (registration) => {
          const users = await User.find({ registerNumber: { $in: registration.registerNumbers } })
              .select('name class email registerNumber phoneNumber'); // Select relevant fields

          return {
              registerNumbers: registration.registerNumbers, // Grouped register numbers (team)
              users,
              registeredAt: registration.registeredAt // Optional: include registration timestamp
          };
      }));

      res.json(participantsData);
  } catch (error) {
      console.error('Error fetching participants:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
