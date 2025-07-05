// config/firebase.js (Backend-safe version)

// Import only necessary functions for backend
const { initializeApp } = require("firebase/app");

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA1ItvYhIbYji92Y8O1INpoDLwzy3hmsig",
  authDomain: "otp-verification-de8cb.firebaseapp.com",
  projectId: "otp-verification-de8cb",
  storageBucket: "otp-verification-de8cb.appspot.com",
  messagingSenderId: "929967659728",
  appId: "1:929967659728:web:015703e56fe2d8e2369cd5",
  measurementId: "G-ZCCHCQ2MKS" // This is ignored in backend
};

// Initialize Firebase (for frontend only, but safe here)
const app = initializeApp(firebaseConfig);

// ❌ DO NOT include this line in Node.js:
// const analytics = getAnalytics(app);

module.exports = { app };
