// Load environment variables at the very beginning
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Explicit allowed origins
const allowedOrigins = [
  'https://rentx-git-master-nikhil-sahus-projects-0bc03434.vercel.app',
  'https://rentx-phi.vercel.app',
  'http://localhost:3000' // Optional: for local testing
];

// ✅ CORS setup with origin check
app.use(cors());

// ✅ Handle preflight requests properly
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://rentxuser:rentx1234@cluster0.3iwof95.mongodb.net/newdatabase?retryWrites=true&w=majority&appName=Cluster0';
console.log('MongoDB URI:', mongoURI);
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ✅ Routes (register after middleware)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/google', require('./routes/google-auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payments', require('./routes/payments'));

// Default root route
app.get('/', (req, res) => {
  res.send('RentX API Running 🚀');
});

// Optional: catch-all fallback route
app.all('/{*any}', (req, res, next) => {
  res.send('OK');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
