const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
console.log("Cloud Name check:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key check:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret check:", !!process.env.CLOUDINARY_API_SECRET);
// Tumhari .env file se keys nikal kar Cloudinary ko connect karna
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Photo kahan aur kaise save hogi uski setting
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vibecheck_profiles', // Cloudinary par is naam ka folder ban jayega
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
});

const upload = multer({ storage });

module.exports = upload;