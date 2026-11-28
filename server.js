const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Yeh sabse zaroori line hai jo Express app banati hai
const app = express();

// Middlewares - Yeh dono yahan hone chahiye
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://check-my-vibes.netlify.app",
        "https://vibe-check-backend-six.vercel.app" // 👈 YEH NAYA LINK ADD KIYA
    ],
    credentials: true
}));
app.use(express.json()); // Frontend se aane wale JSON data ke liye

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully! 🟢'))
    .catch((err) => console.log('MongoDB connection error 🔴:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const ratingRoutes = require('./routes/ratingRoutes');
app.use('/api/ratings', ratingRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
// Test Route
app.get('/', (req, res) => {
    res.send('VibeCheck API is running like a rocket! 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});