const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  altPhone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  deliveryMethod: {
    type: String,
    enum: ['Pickup', 'Delivery'],
    default: 'Pickup'
  },
  preferredTime: {
    type: String,
    required: false
  },
  specialRequests: {
    type: String,
    required: false
  },
  pickupDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentId: {
    type: String
  },
  paymentAmount: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
