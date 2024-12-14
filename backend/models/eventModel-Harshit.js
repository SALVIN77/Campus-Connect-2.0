const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    clubName: { type: String, required: true },           // New field for Club Name
    eventType: { type: String, enum: ['Individual', 'Group'], required: true }, // New field for Event Type
    numParticipants: { type: Number, default: 1 },        // New field for Number of Participants (only for Group events)
    department: { type: String, required: true },         // New field for Department
    rules: { type: String },                              // New field for Rules/Guidelines
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String, required: true }, // References the participants (Users)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // References the user (coordinator) who created the event
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
