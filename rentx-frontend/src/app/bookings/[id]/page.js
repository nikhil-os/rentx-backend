"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/utils/api";
import Image from "next/image";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRegClock, FaTruck, FaCommentDots, FaCalendarAlt, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaLocationArrow } from "react-icons/fa";

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching booking with ID:", bookingId);
        const data = await api.get(`/bookings/${bookingId}`);
        console.log("Booking data received:", data);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
      }
      setLoading(false);
    }
    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="text-center py-20 text-lg">Loading booking details...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!booking) return <div className="text-center py-20">No booking found.</div>;

  // Calculate days left and total days
  const start = new Date(booking.pickupDate);
  const end = new Date(booking.returnDate);
  const today = new Date();
  
  // Set times to midnight for accurate day calculation
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  let daysLeft = 0;
  let totalDays = 0;
  
  if (!isNaN(start) && !isNaN(end)) {
    // Calculate total days (add 1 because both pickup and return days are counted)
    totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate days left based on today's date
    if (today < start) {
      // Booking hasn't started yet
      daysLeft = totalDays;
    } else if (today > end) {
      // Booking has ended
      daysLeft = 0;
    } else {
      // Booking is ongoing
      daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24)) + 1;
    }
  }
  
  const pricePerDay = booking.rental?.price || 0;
  const totalPrice = pricePerDay * totalDays;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 relative">
        <button
          className="absolute top-4 left-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-4 py-2 rounded-lg font-semibold shadow"
          onClick={() => router.push("/bookings")}
        >
          ← Back to Bookings
        </button>
        <h2 className="text-3xl font-extrabold text-emerald-900 text-center mb-8 font-playfair tracking-wide drop-shadow">Booking Details</h2>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0 w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 border border-emerald-200 flex items-center justify-center mx-auto md:mx-0">
            {booking.rental?.image && (
              <Image
                src={booking.rental.image.startsWith('http') ? booking.rental.image : `${process.env.NEXT_PUBLIC_IMAGE_URL}${booking.rental.image}`}
                alt={booking.rental?.title}
                className="object-cover w-full h-full"
                width={160}
                height={160}
              />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <div className="text-2xl font-bold text-emerald-900 flex items-center gap-2"><FaUser className="text-emerald-600" /> {booking.name}</div>
            {booking.email && <div className="text-lg text-gray-700 flex items-center gap-2"><FaEnvelope className="text-emerald-400" /> {booking.email}</div>}
            <div className="text-lg text-gray-700 flex items-center gap-2"><FaPhone className="text-emerald-400" /> {booking.phone}</div>
            {booking.altPhone && <div className="text-base text-gray-500 flex items-center gap-2"><FaPhone className="text-emerald-200" /> Alt: {booking.altPhone}</div>}
            <div className="text-base text-gray-700 flex items-center gap-2"><FaMapMarkerAlt className="text-emerald-600" /> {booking.address}</div>
            {booking.deliveryMethod && <div className="text-base text-gray-700 flex items-center gap-2"><FaTruck className="text-emerald-600" /> {booking.deliveryMethod}</div>}
            {booking.preferredTime && <div className="text-base text-gray-700 flex items-center gap-2"><FaRegClock className="text-emerald-600" /> {booking.preferredTime}</div>}
            {booking.specialRequests && <div className="text-base text-gray-700 flex items-center gap-2"><FaCommentDots className="text-emerald-600" /> {booking.specialRequests}</div>}
            {booking.rental?.location && <div className="text-base text-gray-700 flex items-center gap-2"><FaLocationArrow className="text-emerald-600" /> {booking.rental.location}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-emerald-50 rounded-xl p-4 flex flex-col gap-2 shadow">
            <div className="font-semibold text-emerald-900 flex items-center gap-2"><FaCalendarAlt className="text-emerald-600" /> Pickup Date: <span className="ml-auto">{new Date(booking.pickupDate).toLocaleDateString()}</span></div>
            <div className="font-semibold text-emerald-900 flex items-center gap-2"><FaCalendarAlt className="text-amber-600" /> Return Date: <span className="ml-auto">{new Date(booking.returnDate).toLocaleDateString()}</span></div>
            <div className="font-semibold text-emerald-900 flex items-center gap-2"><FaRegClock className="text-emerald-600" /> Total Days: <span className="ml-auto">{totalDays}</span></div>
            <div className="font-semibold text-emerald-900 flex items-center gap-2"><FaRegClock className="text-emerald-600" /> Days Left: <span className={daysLeft <= 2 ? 'text-red-600 font-bold ml-auto' : 'text-emerald-700 font-bold ml-auto'}>{daysLeft}</span></div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 flex flex-col gap-2 shadow">
            <div className="font-semibold text-emerald-900 flex items-center gap-2"><FaRupeeSign className="text-emerald-600" /> Price/Day: <span className="ml-auto">₹{pricePerDay}</span></div>
            <div className="font-semibold text-emerald-900 flex items-center gap-2"><FaRupeeSign className="text-amber-600" /> Total Price: <span className="ml-auto">₹{totalPrice}</span></div>
            <div className="font-semibold text-emerald-900 flex items-center gap-2">Payment Status: <span className="ml-auto flex items-center gap-1">{booking.paymentStatus === 'Paid' ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />} {booking.paymentStatus || 'Pending'}</span></div>
          </div>
        </div>
        <div className="bg-emerald-100/60 rounded-xl p-4 flex flex-col gap-2 shadow text-center">
          <div className="text-lg font-bold text-emerald-900">Product Booked:</div>
          <div className="text-xl font-semibold text-emerald-800">{booking.rental?.title || booking.rental?.name || 'Product'}</div>
          <div className="text-base text-gray-700">{booking.rental?.description}</div>
        </div>
      </div>
    </div>
  );
}