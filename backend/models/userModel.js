const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'coordinator'], required: true },
    department: { type: String, required: true },  // Common department field
    class: { type: String },  // Only for students
    registerNumber: { type: String },  // Only for students
    clubName: { type: String },  // Only for coordinators
    phoneNumber: { type: String },  // Only for coordinators
    profileImage: {
        type: String,
        default: ''  // Default profile image path
    }
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);