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
    polls: {
        redFlag: String,
        partyVibe: String
    },
    comment: {
        type: String,
        default: "Silent observer... 👀"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rating', ratingSchema);