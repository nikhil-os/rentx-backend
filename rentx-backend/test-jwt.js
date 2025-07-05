// Test JWT token generation
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('JWT_SECRET type:', typeof process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

// Check if .env file exists and read its contents
try {
  if (fs.existsSync('.env')) {
    console.log('.env file exists');
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log('.env file content:', envContent);
  } else {
    console.log('.env file does not exist');
  }
} catch (err) {
  console.error('Error checking .env file:', err);
}

// Use a hardcoded secret for testing
const secret = process.env.JWT_SECRET || 'fallback_secret_for_testing_only';
console.log('Using secret:', secret);
console.log('Secret type:', typeof secret);
console.log('Secret length:', secret.length);

try {
  const payload = { id: '123456789' };
  console.log('Payload:', payload);
  
  // Try with the secret
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  console.log('Token generated successfully:', token);
  
  // Verify the token
  const decoded = jwt.verify(token, secret);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.error('JWT Error:', error);
} 