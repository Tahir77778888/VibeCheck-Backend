const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rating = require('../models/Rating');
const { upload } = require('../config/cloudinary');

// Route 1: Naya Account Banana (POST /api/users/create)
router.post('/create', async (req, res) => {
    try {
        const { name, username } = req.body;

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

// POST /api/users/:username/profile-pic (Base64 / URL image update)
router.post('/:username/profile-pic', async (req, res) => {
    try {
        const cleanUsername = req.params.username.replace(/^@/, '').trim();
        const { profilePic } = req.body;

        if (!profilePic || typeof profilePic !== 'string') {
            return res.status(400).json({ message: 'Valid profilePic image is required.' });
        }

        const escapedUsername = cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const updatedUser = await User.findOneAndUpdate(
            { username: new RegExp(`^${escapedUsername}$`, 'i') },
            { $set: { profilePic } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Profile picture updated!',
            profilePic: updatedUser.profilePic,
            user: updatedUser
        });
    } catch (err) {
        console.error('Error updating profilePic:', err);
        return res.status(500).json({ message: 'Failed to update profile picture.' });
    }
});

// Update Custom Question
router.post('/:username/update-question', async (req, res) => {
    try {
        const { question } = req.body;
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ error: "User nahi mila" });

        user.customQuestion = question;
        await user.save();
        res.json({ success: true, customQuestion: user.customQuestion });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Route 2: Profile aur saare Secret Comments fetch karna (GET /api/users/:username)
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ratings = await Rating.find({ userId: user._id }).sort({ createdAt: -1 });

        let averageScores = { trust: 50, vibe: 50, intellect: 50, humor: 50 };

        if (ratings.length > 0) {
            let total = { trust: 0, vibe: 0, intellect: 0, humor: 0 };
            ratings.forEach((r) => {
                total.trust += r.scores.trust || 0;
                total.vibe += r.scores.vibe || 0;
                total.intellect += r.scores.intellect || 0;
                total.humor += r.scores.humor || 0;
            });

            averageScores = {
                trust: Math.round(total.trust / ratings.length),
                vibe: Math.round(total.vibe / ratings.length),
                intellect: Math.round(total.intellect / ratings.length),
                humor: Math.round(total.humor / ratings.length)
            };
        }

        res.json({
            user: user,
            averageScores: averageScores,
            ratings: ratings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error in fetching profile", error: error.message });
    }
});

// Route 3: Cloudinary Multipart Photo Upload (POST /api/users/:username/upload)
router.post('/:username/upload', upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Photo upload nahi hui bhai!" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            { profilePic: req.file.path },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User nahi mila" });
        }

        res.json({ message: "DP ekdum mast update ho gayi! 🔥", user: updatedUser });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;