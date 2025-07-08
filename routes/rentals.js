const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const Rental = require('../models/Rental');
const auth = require('../middleware/auth');

// Logging all incoming requests
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 🔒 Create a rental (Protected)
router.post('/', auth, async (req, res) => {
  const { title, description, price, image, image2, image3, location, category } = req.body;
  try {
    const newRental = new Rental({
      title,
      description,
      price,
      image,
      image2,
      image3,
      location,
      category,
      user: req.userId,
    });

    await newRental.save();
    res.status(201).json(newRental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📦 Upload image (Protected)
router.post('/upload', auth, upload.single('image'), (req, res) => {
  try {
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Image upload failed' });
  }
});

// 🌍 Get all rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().populate('user', 'name email');
    res.json(Array.isArray(rentals) ? rentals : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', data: [] });
  }
});

// 🔍 Search rentals by location
router.get('/search', async (req, res) => {
  const { location } = req.query;
  try {
    const trimmedLocation = location?.trim();
    if (!trimmedLocation) {
      return res.status(400).json({ message: "Location query is required" });
    }

    const regex = new RegExp(trimmedLocation, 'i');
    const rentals = await Rental.find({ location: { $regex: regex } });
    res.json(rentals);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👤 Get rentals created by the logged-in user (Protected)
router.get('/my', auth, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch user rentals' });
  }
});

// 🔧 Update rental by ID (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this rental' });
    }

    const { title, description, price, image, location } = req.body;
    if (title) rental.title = title;
    if (description) rental.description = description;
    if (price) rental.price = price;
    if (image) rental.image = image;
    if (location) rental.location = location;

    await rental.save();
    res.json(rental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ Delete rental by ID (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this rental' });
    }

    await Rental.deleteOne({ _id: rental._id });
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🛡️ Validate ObjectId before hitting /:id route
router.get('/:id', async (req, res) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
  if (!isValidObjectId) {
    return res.status(400).json({ message: 'Invalid rental ID format' });
  }

  try {
    const rental = await Rental.findById(req.params.id).populate('user', 'name email');
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
