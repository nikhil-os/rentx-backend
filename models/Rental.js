const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  image: String, // We'll handle image upload later
  location: String,
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Rental', RentalSchema);
