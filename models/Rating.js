const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: { type: mongoose.Schema.Types.Mixed, default: {} },
    comment: { type: String, default: "" },
    polls: { type: mongoose.Schema.Types.Mixed, default: {} },
    customAnswer: { type: String, default: "" },
    senderName: { type: String, default: "Anonymous" }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);