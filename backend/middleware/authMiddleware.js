const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = (roles = []) => async (req, res, next) => {
    try {
        // Get the Authorization header
        const authHeader = req.header('Authorization');
        
        
        // Check if Authorization header is present
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        // Check if the Authorization header starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid token format' });
        }


        // Extract the token
        const token = authHeader.replace('Bearer ', '');
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ error: 'Token verification failed. Token might be invalid or expired.' });
        }
        
        // Find the user by decoded ID
        const user = await User.findById(decoded.id);
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Check if the user's role is authorized (if roles are specified)
        if (roles.length > 0 && !roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        // Attach the user to the request object
        req.user = user;        
        // Proceed to the next middleware/route
        next();
    } catch (err) {
        console.error('Authorization error:', err);
        // Handle token verification failure or other errors
        res.status(401).json({ error: 'Unauthorized access' });
    }
};

module.exports = authMiddleware;
