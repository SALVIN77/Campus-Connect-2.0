const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  clubName: String,
  eventType: String,
  numParticipants: Number, // Maximum number of participants allowed
  department: String,
  rules: String,
  image: String,
  // New field to store registered participants
  registrations: [
    {
      registerNumbers: [String], // Array to store register numbers of participants
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to user who registered
      registeredAt: { type: Date, default: Date.now }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }); // CreatedAt and UpdatedAt fields

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
