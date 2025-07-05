import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA1ItvYhIbYji92Y8O1INpoDLwzy3hmsig',
  authDomain: 'otp-verification-de8cb.firebaseapp.com',
  projectId: 'otp-verification-de8cb',
  storageBucket: 'otp-verification-de8cb.appspot.com',
  messagingSenderId: '929967659728',
  appId: '1:929967659728:web:015703e56fe2d8e2369cd5',
};

// Initialize Firebase only on the client side
let app;
let auth;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

function setupRecaptcha(containerId) {
  if (typeof window === 'undefined') return null;
  
  // Ensure auth is initialized
  if (!auth) {
    console.error("Auth not initialized");
    return null;
  }

  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        containerId,
        {
          size: 'invisible',
          callback: (response) => {
            console.log('Recaptcha solved:', response);
          },
          'expired-callback': () => {
            console.warn('Recaptcha expired, retry');
          }
        }
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
    return window.recaptchaVerifier;
  } catch (err) {
    console.error('Recaptcha init error:', err);
    return null;
  }
}

// Helper function to send OTP
async function sendOTP(phoneNumber) {
  if (typeof window === 'undefined' || !auth) return Promise.reject("Auth not available");
  
  try {
    const recaptchaVerifier = window.recaptchaVerifier;
    if (!recaptchaVerifier) {
      throw new Error("Recaptcha not initialized");
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

export { auth, setupRecaptcha, signInWithPhoneNumber, sendOTP };
