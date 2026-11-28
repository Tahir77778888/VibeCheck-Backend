const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, error: "Token nahi mila!" });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, name, email, picture } = payload;

        const safeName = name || 'Vibe_User';
        const username = safeName.toLowerCase().replace(/\s+/g, '_') + '_' + sub.substring(0, 4);

        let user = await User.findOne({ username: username });

        if (!user) {
            user = new User({
                name: safeName,
                username: username,
                email: email,
                profilePic: picture
            });
            await user.save();
        } else if (!user.profilePic && picture) {
            user.profilePic = picture;
            await user.save();
        }

        res.status(200).json({ success: true, user: user });
    } catch (error) {
        console.error("🔥 Google Auth Error:", error.message);
        res.status(500).json({ success: false, error: "Google login fail ho gaya." });
    }
});

module.exports = router;