// BookingForm.js with Firebase OTP verification and booking-specific fields
'use client';
import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, setupRecaptcha, sendOTP } from '@/utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRegClock, FaTruck, FaCommentDots } from 'react-icons/fa';
import { api } from '@/utils/api';

export default function BookingForm({ rentalId }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    altPhone: '',
    address: '',
    deliveryMethod: 'Pickup',
    preferredTime: '',
    specialRequests: '',
    pickupDate: '',
    returnDate: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      setProductLoading(true);
      setProductError('');
      try {
        if (rentalId) {
          const data = await api.get(`/rentals/${rentalId}`);
          console.log("Product data:", data); // Debug log
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProductError('Failed to load product info');
      }
      setProductLoading(false);
    }
    if (rentalId) fetchProduct();
  }, [rentalId]);

  useEffect(() => {
    // Setup recaptcha only on client-side and only once
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      try {
        // Create a new recaptcha verifier
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log("Recaptcha verified");
            setRecaptchaReady(true);
          },
          'expired-callback': () => {
            console.log("Recaptcha expired");
            setRecaptchaReady(false);
          }
        });
        
        // Render the recaptcha
        window.recaptchaVerifier.render().then(() => {
          setRecaptchaReady(true);
        }).catch(error => {
          console.error("Error rendering recaptcha:", error);
          setOtpError("Failed to initialize verification system. Please refresh the page.");
        });
      } catch (error) {
        console.error("Error setting up recaptcha:", error);
        setOtpError("Failed to initialize verification system. Please refresh the page.");
      }
    }
    
    // Clean up function to clear recaptcha when component unmounts
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {
          console.error("Error clearing recaptcha:", e);
        }
      }
    };
  }, []);

  const handleSendOtp = async () => {
    setOtpError('');
    if (form.phone.length !== 10) {
      setOtpError('Enter a valid 10-digit phone number.');
      return;
    }
    
    try {
      if (!window.recaptchaVerifier) {
        setOtpError('Verification system not ready. Please refresh the page.');
        return;
      }
      
      const phoneNumber = '+91' + form.phone;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      console.error("OTP Error:", err);
      setOtpError('Failed to send OTP: ' + (err.message || 'Unknown error'));
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
    } catch (err) {
      setOtpError('Invalid OTP.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!showTerms && !termsChecked) {
      setShowTerms(true);
      return;
    }
    if (!termsChecked) {
      setError('You must accept the terms and conditions.');
      return;
    }
    if (!otpVerified) {
      setError('Please verify your phone number with OTP.');
      return;
    }
    if (!form.name || !form.pickupDate || !form.returnDate || !form.email || !form.address) {
      setError('Please fill all required fields.');
      return;
    }
    if (!rentalId) {
      setError('Rental ID is missing.');
      return;
    }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          altPhone: form.altPhone,
          address: form.address,
          deliveryMethod: form.deliveryMethod,
          preferredTime: form.preferredTime,
          specialRequests: form.specialRequests,
          pickupDate: form.pickupDate,
          returnDate: form.returnDate,
          rentalId: rentalId
        }),
      });
      setSuccess(true);
      setTimeout(() => router.push('/bookings'), 1500);
    } catch (err) {
      console.error("Booking creation failed:", err);
      setError("Booking failed. Please try again.");
    }
  }
    
  return (
    <Fragment>
      <style jsx global>{`
        input::placeholder, textarea::placeholder {
          color: #666 !important;
          opacity: 1 !important;
        }
      `}</style>
      <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto border border-emerald-100 relative overflow-hidden">
        {/* Product Name at Top */}
        <div className="mb-8 text-center">
          {productLoading ? (
            <div className="text-lg text-gray-500">Loading product info...</div>
          ) : productError ? (
            <div className="text-lg text-red-600">{productError}</div>
          ) : product ? (
            <div>
              <span className="text-3xl md:text-4xl font-extrabold text-emerald-900 font-playfair drop-shadow">
                {product.title || product.name || "Product"}
              </span>
              {product.category && (
                <span className="ml-2 text-xl md:text-2xl font-semibold text-amber-600 font-serif">({product.category})</span>
              )}
            </div>
          ) : null}
        </div>
        <h2 className="text-3xl font-extrabold mb-6 text-emerald-900 text-center font-playfair tracking-wide drop-shadow">Book Your Product</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded shadow">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded shadow animate-bounce">Booking successful!</div>}
        
        {/* Always render the recaptcha container outside of any conditional rendering */}
        <div id="recaptcha-container" style={{ position: 'absolute', bottom: 0, zIndex: -1, height: 0 }}></div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaUser className="text-black-600 " /> Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          {/* Email */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaEnvelope className="text-emerald-600" /> Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          {/* Phone */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaPhone className="text-emerald-600" /> Phone Number <span className="text-red-500">*</span></label>
            <div className="flex gap-2 items-center">
              <input
                type="tel"
                name="phone"
                className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black"
                value={form.phone}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setForm({ ...form, phone: val });
                  setOtpSent(false);
                  setOtpVerified(false);
                }}
                required
                placeholder="Enter 10-digit phone"
                style={{ minWidth: 0 }}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSent || form.phone.length !== 10}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition disabled:bg-gray-300 disabled:text-gray-500"
                style={{ whiteSpace: 'nowrap' }}
              >
                Send OTP
              </button>
            </div>
            {otpSent && !otpVerified && (
              <div className="mt-2 flex gap-2 items-center">
                <input
                  type="text"
                  className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black"
                  value={otp}
                  onChange={e => setOtp(e.target.value.slice(0, 6))}
                  placeholder="Enter OTP"
                  style={{ minWidth: 0 }}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  Verify
                </button>
              </div>
            )}
            {otpError && <div className="text-xs text-red-600 mt-1">{otpError}</div>}
            {otpVerified && <div className="text-xs text-green-600 mt-1">Phone number verified</div>}
          </div>
          {/* Alternate Phone */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaPhone className="text-emerald-400" /> Alternate Phone</label>
            <input type="tel" name="altPhone" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black" value={form.altPhone} onChange={e => setForm({ ...form, altPhone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} />
          </div>
          {/* Address */}
          <div className="col-span-2 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaMapMarkerAlt className="text-emerald-600" /> Address <span className="text-red-500">*</span></label>
            <textarea name="address" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black min-h-[60px]" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>
          {/* Delivery Method */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaTruck className="text-emerald-600" /> Delivery Method</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="deliveryMethod" value="Pickup" checked={form.deliveryMethod === 'Pickup'} onChange={e => setForm({ ...form, deliveryMethod: e.target.value })} className="accent-emerald-600" /> Pickup
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="deliveryMethod" value="Delivery" checked={form.deliveryMethod === 'Delivery'} onChange={e => setForm({ ...form, deliveryMethod: e.target.value })} className="accent-emerald-600" /> Delivery
              </label>
            </div>
          </div>
          {/* Preferred Time */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaRegClock className="text-emerald-600" /> Preferred Time</label>
            <input type="time" name="preferredTime" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black" value={form.preferredTime} onChange={e => setForm({ ...form, preferredTime: e.target.value })} />
          </div>
          {/* Pickup Date */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black">Pickup Date <span className="text-red-500">*</span></label>
            <input type="date" name="pickupDate" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black" value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} required />
          </div>
          {/* Return Date */}
          <div className="col-span-1 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black">Return Date <span className="text-red-500">*</span></label>
            <input type="date" name="returnDate" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black" value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} required />
          </div>
          {/* Special Requests */}
          <div className="col-span-2 flex flex-col">
            <label className="mb-1 font-semibold flex items-center gap-2 text-black"><FaCommentDots className="text-emerald-600" /> Special Requests</label>
            <textarea name="specialRequests" className="form-input w-full rounded-lg border-black focus:ring-2 focus:ring-emerald-400 bg-white text-black placeholder-black min-h-[60px]" value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} placeholder="Any special instructions or requests?" />
          </div>
          <button type="submit" className="col-span-2 btn w-full bg-gradient-to-r from-emerald-700 to-amber-500 hover:from-emerald-800 hover:to-amber-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
            Book Now
          </button>
        </form>
        {/* Terms and Conditions Modal */}
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-emerald-100">
              <h3 className="text-xl font-bold mb-4 text-emerald-900">Terms and Conditions</h3>
              <ol className="list-decimal list-inside text-gray-700 text-sm mb-4 space-y-1">
                <li>The booking is subject to approval by the owner.</li>
                <li>Payment must be made as per platform policy.</li>
                <li>Use the item responsibly and return in original condition.</li>
                <li>Late returns may incur additional charges.</li>
                <li>Any damage to the item will be chargeable.</li>
                <li>Personal information should not be shared outside the platform.</li>
                <li>Follow all local laws and regulations regarding rentals.</li>
                <li>Disputes will be resolved as per platform rules.</li>
                <li>Booking may be cancelled if terms are violated.</li>
                <li>Platform reserves the right to modify terms at any time.</li>
              </ol>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsChecked}
                  onChange={e => setTermsChecked(e.target.checked)}
                  className="mr-2 accent-emerald-600"
                />
                <label htmlFor="terms" className="text-gray-800 text-sm">I agree to the terms and conditions</label>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => setShowTerms(false)}
                  disabled={!termsChecked}
                >
                  Continue
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold"
                  onClick={() => setShowTerms(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
