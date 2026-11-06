const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
require('dotenv').config();

// 1. Frontend se user is route par aayega, aur hum use Meta (Facebook/Insta) ke login page par bhejenge
router.get('/instagram', (req, res) => {
    const appId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback';

    // Meta ka official login URL
    const url = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=public_profile`;
    res.redirect(url);
});

// 2. Login hone ke baad Meta user ko wapas is route par bhejege ek 'code' ke sath
router.get('/instagram/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Login fail ho gaya bhai.");

    try {
        // Step A: Code badle Access Token lo
        const tokenResponse = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
            params: {
                client_id: process.env.INSTAGRAM_APP_ID,
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                redirect_uri: 'https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram/callback',
                code: code
            }
        });
        const accessToken = tokenResponse.data.access_token;

        // Step B: Token use karke user ka Naam aur DP (picture) maango
        const userResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${accessToken}`);
        const { id, name, picture } = userResponse.data;

        // Unique username banate hain (Ex: tahir_khan_1234)
        const username = name.toLowerCase().replace(/\s+/g, '_') + '_' + id.substring(0, 4);

        // Step C: Check karo user pehle se hai ya naya banana hai
        let user = await User.findOne({ username: username });
        if (!user) {
            user = new User({
                name: name,
                username: username,
                profilePic: picture?.data?.url || '' // Meta se aayi hui photo
            });
            await user.save();
        }

        // Step D: Sab set hone ke baad user ko seedha Frontend par uski link par bhej do!
        res.redirect(`https://check-my-vibes.netlify.app/${username}`);

    } catch (error) {
        console.error("Auth Error:", error.response ? error.response.data : error.message);
        res.redirect('https://check-my-vibes.netlify.app/?error=login_failed');
    }
});

module.exports = router;