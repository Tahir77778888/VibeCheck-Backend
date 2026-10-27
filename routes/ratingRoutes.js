const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');

// Route: Kisi user ko anonymous rate karna (POST /api/ratings/submit)
router.post('/submit', async (req, res) => {
    try {
        const { username, scores, comment } = req.body;

        // 1. Pehle check karo ki jisko rate kar rahe hain wo user exist karta hai ya nahi
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Bhai yeh user toh exist hi nahi karta!" });
        }

        // 2. Nayi anonymous rating save karo
        const newRating = new Rating({
            userId: user._id,
            scores: scores,
            comment: comment
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