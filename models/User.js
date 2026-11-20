const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Jaise: mahir123
    name: { type: String, required: true },
    profilePic: { type: String, default: "" }, // Cloudinary URL baad mein aayega
    title: { type: String, default: "Mysterious Soul" }, // Psychological title
    customQuestion: { type: String, default: "Farewell mein mujhe kya pehenna chahiye?" } // 👈 YEH LINE ADD KARO
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);