// BookingsList.js
// List all bookings for the current user
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [extendDays, setExtendDays] = useState({}); // {bookingId: daysToAdd}
  const [updating, setUpdating] = useState({}); // {bookingId: boolean}
  const [showCost, setShowCost] = useState({}); // {bookingId: boolean}
  const router = useRouter();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError('');
      try {
        // Use the correct backend route for user bookings
        const data = await api.get('/bookings');
        setBookings(data);
      } catch (err) {
        setError(typeof err === 'string' ? err : (err.message || 'Failed to load bookings.'));
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!bookings.length) return <div className="text-center py-10">No bookings found.</div>;

  return (
    <section className="py-10 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-emerald-900 tracking-wide drop-shadow-lg">My Bookings</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookings.map((b, idx) => {
          // Use pickupDate and returnDate for consistency
          let start = new Date(b.pickupDate || b.startDate);
          let end = new Date(b.returnDate || b.endDate);
          
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            start = new Date(); // fallback
            end = new Date();
          }
          
          // Set times to midnight for accurate day calculation
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          // Calculate days left and total days
          let daysLeft = 0;
          let totalDays = 0;

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

          const pricePerDay = b.rental?.price || 0;
          const totalPrice = pricePerDay * totalDays;
          return (
            <div
              key={b._id || idx}
              className="relative bg-white/90 rounded-2xl shadow-2xl border border-emerald-100 p-7 flex flex-col gap-3 hover:shadow-emerald-200 transition-shadow duration-300 cursor-pointer group"
              onClick={() => router.push(`/bookings/${b._id}`)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') router.push(`/bookings/${b._id}`); }}
              aria-label={`View details for booking ${b.rental?.title || b.rental?.name || b.item}`}
            >
              <div className="absolute top-2 right-2 z-10 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold group-hover:bg-emerald-700 group-hover:text-white transition">View Details</div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-emerald-200 flex items-center justify-center">
                  {b.rental?.image && (
                    <Image
                      src={b.rental.image.startsWith('http') ? b.rental.image : `${process.env.NEXT_PUBLIC_IMAGE_URL}${b.rental.image}`}
                      alt={b.rental?.title}
                      className="object-cover w-full h-full"
                      width={64}
                      height={64}
                    />
                  )}
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-900 mb-1 tracking-wide drop-shadow-sm">
                    {b.rental?.title || b.rental?.name || b.item}
                  </div>
                  <div className="text-sm text-gray-500 italic">{b.rental?.location}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-base mb-2">
                <div className="text-gray-700"><span className="font-semibold text-emerald-800">Start:</span> {start.toLocaleDateString()}</div>
                <div className="text-gray-700"><span className="font-semibold text-emerald-800">End:</span> {end.toLocaleDateString()}</div>
                <div className="text-gray-700"><span className="font-semibold text-emerald-800">Status:</span> <span className={b.status === 'Active' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>{b.status || 'Pending'}</span></div>
                <div className="text-gray-700"><span className="font-semibold text-emerald-800">Total Days:</span> {totalDays}</div>
                <div className="text-gray-700"><span className="font-semibold text-emerald-800">Days Left:</span> <span className={daysLeft <= 2 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>{daysLeft}</span></div>
                <div className="text-gray-700"><span className="font-semibold text-emerald-800">Price/Day:</span> ₹{pricePerDay}</div>
                <div className="text-gray-700 col-span-2 md:col-span-1"><span className="font-semibold text-emerald-800">Total Price:</span> <span className="text-emerald-900 font-bold">₹{totalPrice}</span></div>
              </div>
              {showCost[b._id] && extendDays[b._id] > 0 && (
                <div className="w-full mb-2 p-3 bg-emerald-50 rounded-lg text-emerald-900 text-base font-semibold text-center">
                  Extension Cost: ₹{pricePerDay * Number(extendDays[b._id])}<br />
                  New Total Price: ₹{pricePerDay * (totalDays + Number(extendDays[b._id]))}
                </div>
              )}
              {/* Payment Button */}
              <button
                className="mt-2 mb-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
                onClick={e => { e.stopPropagation(); router.push(`/payment?bookingId=${b._id}`); }}
              >
                Pay Now
              </button>
              {/* Extend Booking Section */}
              <div className="mt-4 border-t pt-4 flex flex-col md:flex-row md:items-center gap-3 rounded-xl px-0 py-0">
                <div className="font-semibold text-emerald-900 mb-1 md:mb-0">Extend Booking</div>
                <input
                  type="number"
                  min={1}
                  placeholder="Days to extend"
                  className="border border-emerald-300 px-3 py-2 rounded-lg mr-2 w-28 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-emerald-900 bg-white shadow-sm"
                  value={extendDays[b._id] || ''}
                  onChange={e => setExtendDays({ ...extendDays, [b._id]: e.target.value })}
                  disabled={updating[b._id]}
                />
                <button
                  className="btn btn-sm bg-gradient-to-r from-emerald-700 to-emerald-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-emerald-800 hover:to-emerald-600 transition"
                  disabled={updating[b._id] || !extendDays[b._id] || extendDays[b._id] < 1}
                  onClick={async e => {
                    e.stopPropagation();
                    setShowCost({ ...showCost, [b._id]: true });
                    setUpdating({ ...updating, [b._id]: true });
                    try {
                      const newEnd = new Date(end);
                      newEnd.setDate(newEnd.getDate() + Number(extendDays[b._id]));
                      
                      // Use the correct endpoint and parameter name
                      await api.put(`/bookings/${b._id}`, { 
                        endDate: newEnd.toISOString().split('T')[0] 
                      });
                      
                      // Refetch bookings after update
                      const data = await api.get('/bookings');
                      setBookings(data);
                      setExtendDays({ ...extendDays, [b._id]: '' });
                      setShowCost({ ...showCost, [b._id]: false });
                    } catch (err) {
                      console.error("Error extending booking:", err);
                      alert('Failed to extend booking. Please try again later.');
                    } finally {
                      setUpdating({ ...updating, [b._id]: false });
                    }
                  }}
                >
                  Extend
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
