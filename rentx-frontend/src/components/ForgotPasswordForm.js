'use client';
import { useState, useEffect } from 'react';
import { auth, setupRecaptcha } from '@/utils/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [userVerified, setUserVerified] = useState(false);
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

  const handleVerifyUser = async () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      console.log('Checking user with email:', email);
      
      // Special case for the test email
      if (email === 'test@example.com') {
        console.log('Using test email, bypassing API check');
        setPhone('9876549280');
        setUserVerified(true);
        setLoading(false);
        return;
      }
      
      // First try to check if the email exists directly with the backend
      try {
        const directResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-email-exists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        console.log('Direct backend response status:', directResponse.status);
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log('Direct backend response data:', directData);
          
          if (directData.exists) {
            // Now get the user's phone number directly
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setPhone(userData.phone || '');
              setUserVerified(true);
              return;
            }
          } else {
            setEmailError('No account found with this email. Please sign up.');
            return;
          }
        }
      } catch (directError) {
        console.error('Error with direct API call:', directError);
        // Continue with the Next.js API route as fallback
      }

      // First try to check if the email exists
      const checkEmailResponse = await fetch('/api/auth/check-email-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const emailData = await checkEmailResponse.json();
      console.log('Email check response:', emailData);

      if (!checkEmailResponse.ok) {
        setEmailError('Error checking email. Please try again.');
        return;
      }

      if (!emailData.exists) {
        setEmailError('No account found with this email. Please sign up.');
        return;
      }

      // Now get the user's phone number
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Check user response status:', response.status);
      const data = await response.json();
      console.log('Check user response data:', data);

      if (!response.ok) {
        setEmailError(data.message || 'User not found');
        return;
      }

      // If user exists, store the phone number from the response
      setPhone(data.phone || '');
      setUserVerified(true);
    } catch (error) {
      console.error('Error verifying user:', error);
      setEmailError('Error verifying user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const rawPhone = phone.replace(/[^0-9]/g, '');
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
      setVerified(true);
    } catch (err) {
      setOtpError('Invalid OTP.');
    }
  };

  const handleResetPassword = async () => {
    if (!password || password !== confirm) {
      setMessage('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      // Call the API to update the password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          phone,
          password 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }

      setMessage('✅ Password reset successfully! Redirecting to login...');
      // Clear form fields after successful reset
      setPassword('');
      setConfirm('');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage(`Failed to reset password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-emerald-900 mb-4 text-center">Forgot Password</h2>

      {!verified ? (
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium">Email Address</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your registered email"
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
              />
              <button
                type="button"
                onClick={handleVerifyUser}
                className="px-4 py-2 rounded-md bg-emerald-900 hover:bg-emerald-800 text-white"
                disabled={loading || userVerified}
              >
                {loading ? 'Checking...' : userVerified ? 'Verified' : 'Verify'}
              </button>
            </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Phone Field - visible after email verification */}
          {userVerified && (
            <div>
              <label className="block mb-2 font-medium">Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="e.g., 9876549280"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setPhone(val);
                    setOtpSent(false);
                    setVerified(false);
                    setOtp('');
                  }}
                  disabled={otpSent}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className={`px-4 py-2 rounded-md ${otpSent ? 'bg-gray-400' : 'bg-emerald-900 hover:bg-emerald-800'} text-white`}
                  disabled={otpSent || loading || !userVerified}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">For demo, use a number ending with 9280</p>
            </div>
          )}

          {/* OTP Field - visible after sending OTP */}
          {otpSent && (
            <div>
              <label className="block mb-2 font-medium">Enter OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-emerald-900 text-white px-4 py-2 rounded hover:bg-emerald-800"
                  disabled={loading || verified}
                >
                  {verified ? 'Verified' : 'Verify'}
                </button>
              </div>
              {otpError && <div className="text-sm text-red-600 mt-1">{otpError}</div>}
              
              {verified && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700">Phone number verified successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700">Identity verified! Set your new password</span>
          </div>
          
          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="block mb-2 font-medium">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full bg-emerald-900 text-white py-2 rounded hover:bg-emerald-800"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-center text-gray-700">{message}</p>}
      
      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Remember your password? </span>
        <Link href="/login" className="text-emerald-800 hover:underline">Login</Link>
      </div>

      {/* Always render the recaptcha container */}
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
