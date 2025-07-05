// Script to create a test user
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function createTestUser() {
  try {
    // Check if test user exists
    const testEmail = 'test@example.com';
    const existingUser = await User.findOne({ email: testEmail });

    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      
      // Update the phone number if needed
      if (existingUser.phone !== '9876549280') {
        existingUser.phone = '9876549280';
        await existingUser.save();
        console.log('Updated test user phone number to 9876549280');
      }
    } else {
      // Create a new test user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const newUser = new User({
        name: 'Test User',
        email: testEmail,
        phone: '9876549280',
        password: hashedPassword,
        location: 'Test City, Test State'
      });

      await newUser.save();
      console.log('Created new test user:', newUser);
    }

    // Disconnect from database
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser(); 