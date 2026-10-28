const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rating = require('../models/Rating');
const upload = require('../config/cloudinary');

// Route 1: Naya user create karna (POST /api/users/create)
router.post('/create', async (req, res) => {
    try {
        const { username, name } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Bhai yeh username pehle se kisi ne le liya hai! Koi aur try karo." });
        }

        const newUser = new User({ username, name });
        await newUser.save();

        res.status(201).json({
            message: "Profile successfully ban gayi! 🚀",
            user: newUser,
            shareableLink: `https://vibecheck.me/${username}`
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route 2: Profile photo upload karna (POST /api/users/:username/upload)
router.post('/:username/upload', upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "Bhai yeh user toh exist hi nahi karta!" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Koi photo upload nahi hui!" });
        }

        // Cloudinary ka secure URL user ki profile mein save kar rahe hain
        user.profilePic = req.file.path;
        await user.save();

        res.status(200).json({
            message: "Profile photo ekdum mast set ho gayi! 📸",
            profilePicUrl: user.profilePic
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route 3: Kisi user ki profile aur uski saari ratings dekhna (GET /api/users/:username)
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "Bhai yeh user toh exist hi nahi karta!" });
        }

        const ratings = await Rating.find({ userId: user._id });

        let avgScores = { trust: 0, vibe: 0, intellect: 0, humor: 0, overall: 0 };

        if (ratings.length > 0) {
            ratings.forEach(r => {
                avgScores.trust += r.scores.trust;
                avgScores.vibe += r.scores.vibe;
                avgScores.intellect += r.scores.intellect;
                avgScores.humor += r.scores.humor;
            });

            avgScores.trust = Math.round(avgScores.trust / ratings.length);
            avgScores.vibe = Math.round(avgScores.vibe / ratings.length);
            avgScores.intellect = Math.round(avgScores.intellect / ratings.length);
            avgScores.humor = Math.round(avgScores.humor / ratings.length);

            avgScores.overall = Math.round((avgScores.trust + avgScores.vibe + avgScores.intellect + avgScores.humor) / 4);
        }

        res.status(200).json({
            user: user,
            totalRatings: ratings.length,
            averageScores: avgScores,
            allRatings: ratings
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Yeh hamesha sabse last line honi chahiye!
module.exports = router;