'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { auth, setupRecaptcha } from '@/utils/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import Image from 'next/image';

// Toast Component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between gap-4 z-50 animate-fadeIn">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold text-lg">×</button>
    </div>
  );
}

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '', location: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      try {
        const verifier = setupRecaptcha('recaptcha-container');
        if (verifier) {
          window.recaptchaVerifier = verifier;
        }
      } catch (error) {
        console.error("Recaptcha setup error:", error);
        setOtpError("Failed to initialize verification system. Please refresh the page.");
      }
    }
  }, []);
  
  // Function to get user's location using the browser's geolocation API
  const detectLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    
    // Function to get location using IP API as fallback
    const getLocationByIP = async () => {
      try {
        const response = await fetch(`https://ipapi.co/json/`);
        const data = await response.json();
        
        if (data && data.city) {
          const locationString = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`;
          setForm(prev => ({ ...prev, location: locationString.replace(/^, /, '').replace(/, $/, '') }));
        } else {
          throw new Error("Couldn't get location data");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocationError("Could not detect your location. Please enter manually.");
      } finally {
        setLocationLoading(false);
      }
    };
    
    // Try browser geolocation first
    if (navigator.geolocation) {
      // Set a timeout in case geolocation permission dialog is ignored
      const timeoutId = setTimeout(() => {
        console.log("Geolocation timed out, using IP-based location");
        getLocationByIP();
      }, 5000);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Clear the timeout since we got a response
          clearTimeout(timeoutId);
          
          try {
            // Use the coordinates from geolocation to create a location string
            const { latitude, longitude } = position.coords;
            console.log(`Got coordinates: ${latitude}, ${longitude}`);
            
            // Try to get a reverse geocoding result
            try {
              // Use a free reverse geocoding API
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
              const data = await response.json();
              
              if (data && data.address) {
                const address = data.address;
                const city = address.city || address.town || address.village || address.hamlet || '';
                const state = address.state || address.county || '';
                const country = address.country || '';
                
                const locationString = `${city}, ${state}, ${country}`;
                setForm(prev => ({ ...prev, location: locationString.replace(/^, /, '').replace(/, $/, '').replace(/, , /g, ', ') }));
                setLocationLoading(false);
                return;
              }
            } catch (error) {
              console.error("Error with reverse geocoding:", error);
              // Fall back to IP-based geolocation if reverse geocoding fails
            }
            
            // If reverse geocoding failed, fall back to IP-based location
            await getLocationByIP();
          } catch (error) {
            setLocationError("Could not detect your location. Please enter manually.");
            setLocationLoading(false);
          }
        },
        (error) => {
          // Clear the timeout since we got an error response
          clearTimeout(timeoutId);
          console.error("Geolocation error:", error);
          
          // Show specific error based on the error code
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access was denied. Using IP-based location instead.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable. Using IP-based location instead.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Using IP-based location instead.");
              break;
            default:
              setLocationError("An unknown error occurred. Using IP-based location instead.");
          }
          
          // Fall back to IP-based geolocation
          console.log("Geolocation permission denied, using IP-based location");
          getLocationByIP();
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
      );
    } else {
      // Browser doesn't support geolocation, use IP-based fallback
      getLocationByIP();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    const rawPhone = form.phone.replace(/[^0-9]/g, '');
    if (rawPhone.length !== 10) {
      setOtpError("Enter a valid 10-digit phone number.");
      return;
    }

    const fullPhone = `+91${rawPhone}`;

    if (!fullPhone.endsWith("9280")) {
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (error) {
      console.error("[ERROR] Failed to send OTP:", error);
      setOtpError("Failed to send OTP. Check number or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    if (!otp || otp.length !== 6) {
      setOtpError('Enter the 6-digit OTP.');
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      setCurrentStep(2);
    } catch (err) {
      setOtpError('Invalid OTP.');
    }
  };

  // Add this function to check if email exists
  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) return;
    
    try {
      setEmailChecking(true);
      const response = await fetch('/api/auth/check-email-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.exists) {
        setEmailError('This email is already registered. Please use a different email or login.');
        return true;
      }
      
      setEmailError('');
      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setError('Please verify your phone number before signing up.');
      return;
    }

    const { name, email, phone, password, confirm, location } = form;

    if (!name || !phone || !email.includes('@') || !password || password.length < 6) {
      setError('Please fill all fields correctly.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    // Check if email exists before submitting
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setError('This email address is already registered. Please use a different email or try logging in.');
      return;
    }

    try {
      setLoading(true);
      // Register the user
      await api.post('/auth/signup', { name, phone, email, password, location });
      setSuccess(true);
      
      // Now automatically log in the user
      try {
        const loginResponse = await api.post('/auth/login', { email, password });
        
        // Store the token and user data in localStorage
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        
        // Dispatch a custom event to notify other components about login
        window.dispatchEvent(new Event('loginStatusChanged'));
        
        // Redirect to home page
        router.push('/');
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        // If auto-login fails, still redirect to login page
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (err) {
      // Check for specific error messages from the API
      if (err.message && err.message.includes('Email already in use')) {
        setError('This email address is already registered. Please use a different email or try logging in.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image and info */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-600 text-white p-8 rounded-l-lg">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Join RentX Community</h2>
              <p className="mb-6">Create an account to start renting and listing items.</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Access to thousands of items for rent</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>List your items and earn money</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Secure payment and verification</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="relative h-40 w-full">
                <Image 
                  src="/otpverifyref.png" 
                  alt="RentX Verification" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="md:w-1/2 p-0 md:p-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Signup successful! You can now <Link href="/login" className="underline">login</Link>.</div>}
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className={`flex-1 border-b-2 pb-2 ${currentStep === 1 ? 'border-emerald-800 text-emerald-800' : 'border-gray-200 text-gray-400'}`}>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${currentStep === 1 ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
                Phone Verification
              </div>
              <div className={`flex-1 border-b-2 pb-2 text-center ${currentStep === 2 ? 'border-emerald-800 text-emerald-800' : 'border-gray-200 text-gray-400'}`}>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${currentStep === 2 ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                Account Details
              </div>
            </div>
          </div>

      <form onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
          <div className="flex gap-2">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
              setForm({ ...form, phone: val });
              setOtpSent(false);
              setOtpVerified(false);
              setOtp('');
                      }}
                      required
                      className="form-input flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter 10-digit number"
                    />
                    <button 
                      type="button" 
                      className={`btn px-4 py-2 rounded-md ${otpSent ? 'bg-gray-400' : 'bg-emerald-800 hover:bg-emerald-900'} text-white`}
                      onClick={handleSendOtp} 
                      disabled={otpSent || loading}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
          </div>
                  <p className="text-xs text-gray-500 mt-1">For demo, use a number ending with 9280</p>
        </div>

        {otpSent && !otpVerified && (
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Enter OTP</label>
            <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        maxLength={6}
                        className="form-input flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="6-digit OTP"
                      />
                      <button 
                        type="button" 
                        className="btn bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-md"
                        onClick={handleVerifyOtp}
                      >
                        Verify
                      </button>
            </div>
            {otpError && <div className="text-sm text-red-600 mt-1">{otpError}</div>}
          </div>
        )}

                {otpVerified && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700">Phone number verified successfully!</span>
                  </div>
                )}

                {otpVerified && (
                  <div className="pt-4">
                    <button 
                      type="button" 
                      className="btn bg-emerald-800 hover:bg-emerald-900 text-white w-full py-2 rounded-md"
                      onClick={() => setCurrentStep(2)}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    className="form-input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      setEmailError('');
                    }}
                    onBlur={(e) => checkEmailExists(e.target.value)}
                    required 
                    className="form-input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Enter your email address"
                  />
                  {emailChecking && <p className="text-xs text-gray-500 mt-1">Checking email...</p>}
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Location</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="location" 
                      value={form.location} 
                      onChange={handleChange} 
                      className="form-input flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Your city, region"
                    />
                    <button 
                      type="button" 
                      onClick={detectLocation} 
                      className="btn px-3 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white"
                      disabled={locationLoading}
                    >
                      {locationLoading ? '...' : 'Detect'}
                    </button>
                  </div>
                  {locationError && <p className="text-xs text-red-500 mt-1">{locationError}</p>}
        </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    className="form-input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Create a secure password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirm" 
                    value={form.confirm} 
                    onChange={handleChange} 
                    required 
                    className="form-input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Confirm your password"
                  />
        </div>

                <div className="flex items-center pt-2">
                  <button 
                    type="button" 
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn bg-emerald-800 hover:bg-emerald-900 text-white flex-1 py-2 rounded-md"
                    disabled={loading}
                  >
          {loading ? 'Registering...' : 'Register'}
        </button>
                </div>
              </div>
            )}
      </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-emerald-800 font-medium hover:underline">Login</Link>
          </div>
        </div>
      </div>

      <div id="recaptcha-container" style={{ position: 'absolute', bottom: 0, zIndex: -1, height: 0 }} />

      {showToast && (
        <Toast
          message="Please enter a valid test phone number ending with ******9280"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
