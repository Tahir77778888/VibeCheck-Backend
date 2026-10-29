const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');

// Route: Kisi user ko anonymous rate karna (POST /api/ratings/submit)
router.post('/submit', async (req, res) => {
    try {
        // Yahan dhyan se dekho, humne 'polls' ko bhi req.body se nikal liya hai
        const { username, scores, comment, polls } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Bhai yeh user toh exist hi nahi karta!" });
        }

        // Nayi anonymous rating save karo, isme polls bhi daal diye
        const newRating = new Rating({
            userId: user._id,
            scores: scores,
            comment: comment,
            polls: polls // <-- Naya poll data yahan se database mein jayega
        });

        await newRating.save();

        res.status(201).json({
            message: "Vibe check done! Rating anonymously submit ho gayi. 💯",
            rating: newRating
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;