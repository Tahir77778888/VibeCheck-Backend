const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scores: {
        trust: Number,
        vibe: Number,
        intellect: Number,
        humor: Number
    },
    comment: {
        type: String,
        default: "Silent observer... 👀"
    },
    senderName: {
        type: String,
        default: 'Anonymous'
    },

    // 👇 NAYE 10 POLLS
    polls: {
        q1: String, q2: String, q3: String, q4: String, q5: String,
        q6: String, q7: String, q8: String, q9: String, q10: String
    },

    // 👇 NAYA CUSTOM ANSWER TEXT
    customAnswer: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rating', ratingSchema);