require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });



const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

console.log('[auth.js] JWT_SECRET =', process.env.JWT_SECRET);


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route for /signup to match frontend
router.post('/signup', async (req, res) => {
  console.log('POST /api/auth/signup hit', req.body);
  console.log('BODY RECEIVED:', req.body);
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// LOGIN Route
router.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', user._id);

    // Compare password
    console.log('Comparing passwords');
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      console.log('Password matched');
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return res.status(500).json({ message: 'Error verifying password' });
    }

    // Sign JWT
    const jwtSecret = process.env.JWT_SECRET;
    console.log("JWT Secret length:", jwtSecret ? jwtSecret.length : 0);
    
    if (!jwtSecret) {
      console.error('JWT_SECRET is undefined');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    try {
      const payload = { id: user._id.toString() };
      console.log('Signing JWT with payload:', payload);
      
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
      console.log('Token generated successfully');

      // Return user data and token
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ message: 'Error generating authentication token' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



const authMiddleware = require('../middleware/auth');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




// PUT /api/auth/profile - update user profile info
router.put('/profile', auth, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Use req.userId for consistency with your middleware
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided (hash it)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Return updated user excluding password
    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Check if user exists with email
router.post('/check-user', async (req, res) => {
  console.log('POST /api/auth/check-user hit', req.body);
  const { email } = req.body;
  
  if (!email) {
    console.log('Email is required');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find user by email
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ message: 'User not found with this email' });
    }

    console.log('User found:', user._id);
    // Return success with phone number (masked for privacy except last 4 digits)
    const phone = user.phone || '';
    const maskedPhone = phone.length > 4 
      ? `${phone.slice(0, -4).replace(/\d/g, '*')}${phone.slice(-4)}` 
      : phone;

    res.status(200).json({ 
      message: 'User found',
      phone: user.phone || '' // For development, sending full phone. In production, use maskedPhone
    });
  } catch (err) {
    console.error('Check user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update the reset-password route to also check email
router.post('/reset-password', async (req, res) => {
  console.log('POST /api/auth/reset-password hit', req.body);
  const { email, phone, password } = req.body;
  
  if (!email || !phone || !password) {
    return res.status(400).json({ message: 'Email, phone and password are required' });
  }

  try {
    // Find user by email and phone
    const user = await User.findOne({ email, phone });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email and phone combination' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if email exists
router.post('/check-email-exists', async (req, res) => {
  console.log('POST /api/auth/check-email-exists hit', req.body);
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    // Return whether the email exists
    res.status(200).json({ 
      exists: !!user
    });
  } catch (err) {
    console.error('Check email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
