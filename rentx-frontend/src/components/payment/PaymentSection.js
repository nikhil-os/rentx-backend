// PaymentSection.js
// Main content for the Payment page
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import Script from 'next/script';

export default function PaymentSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('Booking ID is missing');
        setLoading(false);
        return;
      }

      try {
        const data = await api.get(`/bookings/${bookingId}`);
        console.log('Booking details loaded:', data);
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const calculateAmount = () => {
    if (!booking || !booking.rental) return 0;
    
    const start = new Date(booking.pickupDate);
    const end = new Date(booking.returnDate);
    
    // Ensure both dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return booking.rental.price || 0; // Default to single day if dates are invalid
    }
    
    // Set time to midnight to calculate full days
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate days difference (add 1 because both pickup and return days are counted)
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return (booking.rental.price || 0) * diffDays;
  };

  const handlePayment = async () => {
    if (!booking) {
      setError('Booking details not available');
      return;
    }
    
    if (!scriptLoaded) {
      setError('Payment system is still loading. Please wait a moment and try again.');
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      const amount = calculateAmount();
      console.log('Creating payment order with amount:', amount);
      
      // Simplified API call with minimal data
      const orderData = await api.post('/payments/create-order', {
        bookingId,
        amount
      });
      
      console.log('Order created successfully:', orderData);
      
      if (!orderData || !orderData.orderId) {
        throw new Error('Failed to create payment order');
      }
      
      // Display amount is the actual amount, not the test amount
      const displayAmount = orderData.actualAmount || amount;
      
      const options = {
        key: orderData.key || 'rzp_test_qr86rR2VWnKDmy',
        amount: orderData.amount, // This is the test amount (100 paise = ₹1)
        currency: orderData.currency || 'INR',
        name: 'RentX',
        description: `Payment for Booking #${bookingId}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying payment:', response);
            // Verify payment on backend
            const verificationData = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });
            
            console.log('Payment verification response:', verificationData);
            
            if (verificationData.success) {
              setPaymentSuccess(true);
              // Redirect to homepage after 2 seconds
              setTimeout(() => {
                router.push('/');
              }, 2000);
            }
          } catch (err) {
            console.error('Payment verification failed:', err);
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: booking.name || '',
          contact: booking.phone || '',
        },
        notes: {
          booking_id: bookingId,
          actual_amount: displayAmount
        },
        theme: {
          color: '#047857'
        }
      };
      
      console.log('Initializing Razorpay with options:', options);
      
      // Check if Razorpay is available
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Add event listener for payment failure
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
    } catch (err) {
      console.error('Payment initiation failed:', err);
      // Provide a more user-friendly error message
      const errorMessage = err.message && err.message.includes('Amount exceeds') 
        ? 'The payment amount exceeds the allowed limit. We are using a test amount instead.'
        : err.message || 'Please try again.';
      
      setError(`Failed to initiate payment: ${errorMessage}`);
      setProcessing(false);
    }
  };

  const handleScriptLoad = () => {
    console.log('Razorpay script loaded successfully');
    setScriptLoaded(true);
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#F8F1E9]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">Loading Payment Details...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-[#F8F1E9]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center">Payment Error</h2>
          <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
            {error}
          </div>
          <div className="mt-6 text-center">
            <button 
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold"
              onClick={() => router.push('/bookings')}
            >
              Return to Bookings
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (paymentSuccess) {
    return (
      <section className="py-16 bg-[#F8F1E9]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center text-emerald-800">Payment Successful!</h2>
          <div className="bg-emerald-100 text-emerald-800 p-8 rounded-lg text-center">
            <p className="text-xl mb-4">Your payment has been processed successfully.</p>
            <p className="mb-6">You will be redirected to the homepage shortly.</p>
            <div className="animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
        onLoad={handleScriptLoad}
        onError={() => setError('Failed to load payment system. Please refresh the page.')}
      />
      <section className="py-16 bg-[#F8F1E9]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center">Complete Your Payment</h2>
          {bookingId && booking && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-emerald-800">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">Booking ID:</p>
                  <p className="font-mono font-medium">{bookingId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Item:</p>
                  <p className="font-medium">{booking.rental?.title || 'Item'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pickup Date:</p>
                  <p className="font-medium">{new Date(booking.pickupDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Return Date:</p>
                  <p className="font-medium">{new Date(booking.returnDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price per Day:</p>
                  <p className="font-medium">₹{booking.rental?.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount:</p>
                  <p className="font-bold text-emerald-800">₹{calculateAmount()}</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                <p className="text-amber-700 font-medium">⚠️ Test Mode</p>
                <p className="text-sm text-amber-700">For testing purposes, you will be charged &quot;₹1&quot; instead of the actual amount.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-emerald-800 mb-2 font-semibold">Test Payment Information:</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Use any phone number for testing</li>
                  <li>Use UPI option and select &quot;Success&quot; for test payment</li>
                  <li>No actual payment will be processed</li>
                </ul>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <button
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-6 rounded-lg font-bold shadow-lg transition-colors duration-200 flex items-center justify-center"
                onClick={handlePayment}
                disabled={processing || !scriptLoaded}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : !scriptLoaded ? (
                  'Loading Payment System...'
                ) : (
                  'Pay Now with Razorpay'
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
