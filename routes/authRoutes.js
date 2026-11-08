const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
require('dotenv').config();

// Ek chota sa memory guard banaya hai jo double requests ko block karega
const usedCodes = new Set();

// 1. Meta (Facebook/Insta) ke login page par bhejne wala route
router.get('/instagram', (req, res) => {
    const appId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback';

    // 🚨 FIX ADDED: Meta ko force karega ki purana session ignore kare aur buffering roke
    const url = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=public_profile&auth_type=reauthenticate&display=page`;
    res.redirect(url);
});

// 2. Login hone ke baad Meta yahan wapas bhejega
router.get('/instagram/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Login fail ho gaya bhai.");

    // BUG FIX: Agar yeh code abhi abhi process hua hai, toh dusri duplicate request ko ignore kardo!
    if (usedCodes.has(code)) {
        console.log("Duplicate request ignored! 🛡️");
        return;
    }
    usedCodes.add(code); // Code ko used list mein daal do

    try {
        console.log("Step A: Code se token le rahe hain... ⏳");
        const tokenResponse = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
            params: {
                client_id: process.env.INSTAGRAM_APP_ID,
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                redirect_uri: 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback',
                code: code
            }
        });
        const accessToken = tokenResponse.data.access_token;

        console.log("Step B: Token se user detail le rahe hain... 🔍");
        const userResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${accessToken}`);
        const { id, name, picture } = userResponse.data;

        // BUG FIX: Agar kisi user ka naam Meta se nahi aata toh code crash na ho
        const safeName = name || 'Vibe_User';
        const username = safeName.toLowerCase().replace(/\s+/g, '_') + '_' + id.substring(0, 4);

        console.log("Step C: User DB mein dhoondh/save kar rahe hain... 💾");
        let user = await User.findOne({ username: username });
        if (!user) {
            user = new User({
                name: safeName,
                username: username,
                profilePic: picture?.data?.url || '' // Meta se aayi hui photo
            });
            await user.save();
            console.log("✅ Naya user save ho gaya!");
        } else {
            console.log("✅ Purana user mil gaya!");
        }

        console.log("Step D: Frontend par bhej rahe hain! 🚀");
        res.redirect(`https://check-my-vibes.netlify.app/${username}`);

    } catch (error) {
        console.error("🔥 ERROR CAUGHT:");
        if (error.response) {
            console.error("Meta API Error:", error.response.data); // Meta ka error
        } else {
            console.error("Server/DB Error:", error.message); // Humare DB ka error
        }
        res.redirect('https://check-my-vibes.netlify.app/?error=login_failed');
    }
});

module.exports = router;