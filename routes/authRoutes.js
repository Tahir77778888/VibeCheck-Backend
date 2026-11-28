const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Apne User model ka path check kar lena
require('dotenv').config();

// Google Client initialize kar rahe hain
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('../models/User');

// POST /api/users/:username/profile-pic
router.post('/:username/profile-pic', async (req, res) => {
    try {
        const cleanUsername = req.params.username.replace(/^@/, '').toLowerCase();
        const { profilePic } = req.body;

        if (!profilePic || typeof profilePic !== 'string') {
            return res.status(400).json({ message: 'Valid profilePic image is required.' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: cleanUsername },
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
// Google Login Route (POST request)
router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, error: "Token nahi mila!" });
    }

    try {
        console.log("Step A: Google Token verify kar rahe hain...");
        // Token ko Google ke servers par verify karna
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, name, email, picture } = payload; // 'sub' = Google ka unique user ID

        console.log("Step B: DB mein check kar rahe hain...");

        // Username create karna
        const safeName = name || 'Vibe_User';
        const username = safeName.toLowerCase().replace(/\s+/g, '_') + '_' + sub.substring(0, 4);

        // 🚨 MAIN FIX: Email ki jagah ab hum seedha username se search karenge
        let user = await User.findOne({ username: username });

        if (!user) {
            user = new User({
                name: safeName,
                username: username,
                email: email,
                profilePic: picture
            });
            await user.save();
            console.log("✅ Naya Google User create ho gaya!");
        } else {
            // Agar pehle se account hai, toh uski profile photo Google wali se update kar do
            user.profilePic = picture;
            await user.save();
            console.log("✅ Purana User wapas aa gaya!");
        }

        // Frontend ko success aur username bhej do
        res.status(200).json({ success: true, user: user });

    } catch (error) {
        console.error("🔥 Google Auth Error:", error.message);
        res.status(500).json({ success: false, error: "Google login fail ho gaya." });
    }
});

module.exports = router;