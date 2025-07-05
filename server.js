// Load environment variables at the very beginning
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const allowedOrigins = ['https://rentx-frontend-ten.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.options('*', cors()); // Handle preflight for all routes

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://rentxuser:rentx1234@cluster0.3iwof95.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log('MongoDB URI:', mongoURI);
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/google', require('./routes/google-auth'));

app.get('/', (req, res) => {
  res.send('RentX API Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const bookingRoutes = require('./routes/bookings');
// Register booking routes after app is initialized
app.use('/api/bookings', bookingRoutes);

app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payments', require('./routes/payments'));

