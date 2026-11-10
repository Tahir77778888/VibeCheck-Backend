const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
require('dotenv').config();

const usedCodes = new Set();

// 1. Meta (Facebook/Instagram) ke naye login page par bhejne wala route
router.get('/instagram', (req, res) => {
    const appId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback';

    // 🚨 NAYA META URL: Ab hum purane api.instagram.com ki jagah Meta ka naya OAuth use karenge
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=public_profile&response_type=code`;
    res.redirect(url);
});

// 2. Login hone ke baad Meta yahan wapas bhejega
router.get('/instagram/callback', async (req, res) => {
    let { code } = req.query;
    if (!code) return res.status(400).send("Login fail ho gaya bhai.");

    // Double request blocker
    if (usedCodes.has(code)) {
        console.log("Duplicate request ignored! 🛡️");
        return;
    }
    usedCodes.add(code);

    try {
        console.log("Step A: Meta Code se token le rahe hain... ⏳");

        // 🚨 NAYA TOKEN URL: Meta Graph API ka use karke token lena (GET request)
        const tokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
            params: {
                client_id: process.env.INSTAGRAM_APP_ID,
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                redirect_uri: 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback',
                code: code
            }
        });

        const accessToken = tokenResponse.data.access_token;

        console.log("Step B: Token se user detail le rahe hain... 🔍");

        // 🚨 NAYA USER DATA URL: Asli DP (picture) aur naam nikalna
        const userResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${accessToken}`);
        const { id, name } = userResponse.data;

        // Asli DP ka link yahan se milega
        const profilePicUrl = userResponse.data.picture?.data?.url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        const safeName = name || 'Vibe_User';
        const username = safeName.toLowerCase().replace(/\s+/g, '_') + '_' + id.substring(0, 4);

        console.log("Step C: User DB mein dhoondh/save kar rahe hain... 💾");
        let user = await User.findOne({ username: username });

        if (!user) {
            user = new User({
                name: safeName,
                username: username,
                profilePic: profilePicUrl // 🎉 Ab default avatar ki jagah asli photo save hogi!
            });
            await user.save();
            console.log("✅ Naya Meta user save ho gaya!");
        } else {
            console.log("✅ Purana Meta user mil gaya!");
        }

        console.log("Step D: Frontend par bhej rahe hain! 🚀");
        res.redirect(`https://check-my-vibes.netlify.app/${username}`);

    } catch (error) {
        console.error("🔥 ERROR CAUGHT:");
        if (error.response) {
            console.error("Meta API Error:", error.response.data);
        } else {
            console.error("Server/DB Error:", error.message);
        }
        res.redirect('https://check-my-vibes.netlify.app/?error=login_failed');
    }
});

module.exports = router;