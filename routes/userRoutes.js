const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rating = require('../models/Rating');

// Route 1: Naya Account Banana (POST /api/users/create)
router.post('/create', async (req, res) => {
    try {
        const { name, username } = req.body;

        // Check karna ki username pehle se toh nahi hai
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken bhai." });
        }

        const newUser = new User({ name, username });
        await newUser.save();

        res.status(201).json({ message: "Account ekdum mast ban gaya!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route 2: Profile aur saare Secret Comments fetch karna (GET /api/users/:username)
router.get('/:username', async (req, res) => {
    try {
        // 1. User ko database mein dhundo
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Is user ke saare secret ratings aur comments dhundo (Naye comments pehle dikhenge)
        const ratings = await Rating.find({ userId: user._id }).sort({ createdAt: -1 });

        // 3. Average scores calculate karo
        let averageScores = { trust: 50, vibe: 50, intellect: 50, humor: 50 };

        if (ratings.length > 0) {
            let total = { trust: 0, vibe: 0, intellect: 0, humor: 0 };
            ratings.forEach(r => {
                total.trust += r.scores.trust || 0;
                total.vibe += r.scores.vibe || 0;
                total.intellect += r.scores.intellect || 0;
                total.humor += r.scores.humor || 0;
            });

            // Math.round se exact integer value aayegi
            averageScores = {
                trust: Math.round(total.trust / ratings.length),
                vibe: Math.round(total.vibe / ratings.length),
                intellect: Math.round(total.intellect / ratings.length),
                humor: Math.round(total.humor / ratings.length)
            };
        }

        // 4. Sab kuch ek sath frontend ko bhej do
        res.json({
            user: user,
            averageScores: averageScores,
            ratings: ratings // <-- Secret comments ab yahan se jayenge!
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error in fetching profile", error: error.message });
    }
});

module.exports = router;