const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jis user ko rate kar rahe hain
    scores: {
        trust: { type: Number, required: true, min: 1, max: 100 },
        vibe: { type: Number, required: true, min: 1, max: 100 },
        intellect: { type: Number, required: true, min: 1, max: 100 },
        humor: { type: Number, required: true, min: 1, max: 100 }
    },
    comment: { type: String, default: "" },
    isAnonymous: { type: Boolean, default: true } // Viral factor ke liye default true
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);