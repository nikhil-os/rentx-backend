// routes/upload.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();

// 🔐 Configure Cloudinary
cloudinary.config({
  cloud_name: 'dh9dx9idh',
  api_key: '446154134913119',
  api_secret: '4BMIk9ZLN3HbwszjxdFeI_r3lS0',
});

// 📂 Setup Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rentx', // Optional: name of folder in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// ✅ POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'File upload failed' });
  }

  // 🎯 Return the Cloudinary secure URL
  res.json({ url: req.file.path });
});

module.exports = router;
