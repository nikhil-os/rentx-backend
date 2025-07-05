const multer = require('multer');
const path = require('path');

const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const auth = require('../middleware/auth');

router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});



// Create rental post (protected)
router.post('/', auth, async (req, res) => {
  console.log('POST /rentals req.body:', req.body); // Debug: log incoming data
  const { title, description, price, image, location, category } = req.body;

  try {
    const newRental = new Rental({
      title,
      description,
      price,
      image,
      location,
      category, // <-- ensure category is saved
      user: req.userId, // Comes from auth middleware
    });

    await newRental.save();
    res.status(201).json(newRental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name with extension
  }
});

const upload = multer({ storage: storage });


// Get all rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().populate('user', 'name email');
    if (!Array.isArray(rentals)) {
      return res.json([]);
    }
    res.json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', data: [] });
  }
});

// Place this route BEFORE any route with '/:id' to avoid route conflicts
router.get('/my', auth, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch user rentals' });
  }
});

// Move this route ABOVE any '/:id' route to prevent CastError
router.get('/search', async (req, res) => {
    const { location } = req.query;
    try {
        const trimmedLocation = location.trim();
        console.log('Search query location (trimmed):', trimmedLocation);
        if (!trimmedLocation) {
            return res.status(400).json({ message: "Location query is required" });
        }

        const regex = new RegExp(trimmedLocation, 'i');
        console.log('Regex used for search:', regex);

        // Log all rentals for debugging
        const allRentals = await Rental.find();
        console.log('All rentals in DB:', allRentals.map(r => ({ location: r.location, id: r._id })));

        const rentals = await Rental.find({
            location: { $regex: regex }
        });

        res.json(rentals);
    } catch (error) {
        console.error("Search Error:", error); // Log full error object
        res.status(500).json({ message: "Server error" });
    }
});


// Get rental by ID


// Image upload route
router.post('/upload', auth, upload.single('image'), (req, res) => {
  try {
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Image upload failed' });
  }
});

// Update rental by id (PUT /api/rentals/:id)
router.put('/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    // Use req.userId for consistency
    if (!rental.user || rental.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this rental' });
    }
    // Update fields if provided
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

// Delete rental by id (DELETE /api/rentals/:id)
router.delete('/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    // Use req.userId for consistency
    if (!rental.user || rental.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this rental' });
    }
    await Rental.deleteOne({ _id: rental._id });
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Prevent invalid non-ObjectId access to /:id
router.get('/:id', async (req, res, next) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
  if (!isValidObjectId) {
    return res.status(400).json({ message: 'Invalid rental ID format' });
  }
  next();
});


router.get('/:id', async (req, res) => {
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

