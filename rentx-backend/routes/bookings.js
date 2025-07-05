const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// POST /api/bookings - Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, email, altPhone, address, deliveryMethod, preferredTime, specialRequests, pickupDate, returnDate, rentalId } = req.body;

    if (!name || !phone || !pickupDate || !returnDate || !rentalId || !email || !address) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const booking = new Booking({
      name,
      phone,
      email,
      altPhone,
      address,
      deliveryMethod,
      preferredTime,
      specialRequests,
      pickupDate,
      returnDate,
      rental: rentalId,
      user: req.userId
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking Save Error:", err);
    res.status(500).json({ message: 'Server error while saving booking' });
  }
});

// GET /api/bookings - Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    console.log('User ID from token:', req.userId);
    const bookings = await Booking.find({ user: req.userId }).populate('rental');
    res.json(bookings);
  } catch (err) {
    console.error('Booking  error:', err);
    res.status(500).json({ message: 'Server error while ing bookings' });
  }
});

// GET /api/bookings/my - Get bookings for the logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate('rental');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all bookings (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    // Optional: restrict this route to admin-only users
    // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const bookings = await Booking.find().populate('user', 'name email').populate('rental');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error ing all bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/:id - Get a booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('rental');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error("Booking  Error:", err);
    res.status(500).json({ message: 'Server error while ing booking' });
  }
});

// PUT /api/bookings/:id - Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    // Fields that can be updated
    const updatableFields = [
      'name', 'phone', 'email', 'altPhone', 'address', 
      'deliveryMethod', 'preferredTime', 'specialRequests', 
      'pickupDate', 'returnDate', 'status', 'paymentStatus'
    ];
    
    // Update only the fields that are provided in the request
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });
    
    // Handle special case for endDate (for booking extensions)
    if (req.body.endDate) {
      booking.returnDate = req.body.endDate;
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error("Booking Update Error:", err);
    res.status(500).json({ message: 'Server error while updating booking' });
  }
});

// DELETE a booking (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Optional: only allow admin users
    // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
