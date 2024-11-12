
const cloudinary = require('cloudinary').v2;  // Ensure you're using the v2 version

require('dotenv').config();  // Load environment variables

cloudinary.config({
    cloud_name: "dzpxogpyx",
    api_key: "694667456448274",
    api_secret: "Ysq4bInMjk7nrHa1wQmimSfbE3E",
});

module.exports = cloudinary;
