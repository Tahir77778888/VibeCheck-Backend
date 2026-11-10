const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
require('dotenv').config();

const usedCodes = new Set();

// 1. Asli Instagram ke login page par bhejne wala route
router.get('/instagram', (req, res) => {
    const appId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback';

    // 🚨 NAYA INSTAGRAM URL (Ab neeli Facebook screen nahi, Insta khulega)
    const url = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
    res.redirect(url);
});

// 2. Login hone ke baad Instagram yahan wapas bhejega
router.get('/instagram/callback', async (req, res) => {
    let { code } = req.query;
    if (!code) return res.status(400).send("Login fail ho gaya bhai.");

    // BUG FIX: Instagram kabhi-kabhi code ke end mein '#_' laga deta hai, usko hatana zaroori hai
    if (code.endsWith('#_')) {
        code = code.replace('#_', '');
    }

    // Double request blocker
    if (usedCodes.has(code)) {
        console.log("Duplicate request ignored! 🛡️");
        return;
    }
    usedCodes.add(code);

    try {
        console.log("Step A: Insta Code se token le rahe hain... ⏳");

        // Insta ka rule hai ki token ke liye data URL-encoded format mein POST karna hota hai
        const params = new URLSearchParams();
        params.append('client_id', process.env.INSTAGRAM_APP_ID);
        params.append('client_secret', process.env.INSTAGRAM_APP_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback');
        params.append('code', code);

        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        console.log("Step B: Token se user detail le rahe hain... 🔍");
        // Insta ke Graph API se user ki details lena
        const userResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
        const { id, username: instaHandle } = userResponse.data;

        const safeName = instaHandle || 'Vibe_User';
        const username = safeName.toLowerCase().replace(/\s+/g, '_') + '_' + id.substring(0, 4);

        console.log("Step C: User DB mein dhoondh/save kar rahe hain... 💾");
        let user = await User.findOne({ username: username });

        if (!user) {
            user = new User({
                name: safeName,
                username: username,
                // Note: Insta API privacy ki wajah se DP nahi deta, isliye ek default avatar laga diya hai taaki frontend na toote
                profilePic: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            });
            await user.save();
            console.log("✅ Naya Insta user save ho gaya!");
        } else {
            console.log("✅ Purana Insta user mil gaya!");
        }

        console.log("Step D: Frontend par bhej rahe hain! 🚀");
        res.redirect(`https://check-my-vibes.netlify.app/${username}`);

    } catch (error) {
        console.error("🔥 ERROR CAUGHT:");
        if (error.response) {
            console.error("Insta API Error:", error.response.data); // Insta ka error
        } else {
            console.error("Server/DB Error:", error.message); // Humare DB ka error
        }
        res.redirect('https://check-my-vibes.netlify.app/?error=login_failed');
    }
});

module.exports = router;