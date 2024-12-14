const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware
const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Save images to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique file name
  }
});

const upload = multer({ storage });

// Profile image upload route
router.post('/uploadProfileImage', authMiddleware(), upload.single('profileImage'), async (req, res) => {
  try {
    // Ensure the file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user._id; // Get user ID from middleware (populated by JWT)
    const imagePath = `/uploads/${req.file.filename}`; // Construct path to the image

    // Update the user's profile image in the database
    const user = await User.findByIdAndUpdate(userId, { profileImage: imagePath }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile image uploaded successfully', imagePath });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
