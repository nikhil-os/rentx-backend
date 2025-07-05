// bookings/page.js
// User bookings page route for /bookings
import BookingsList from '@/components/booking/BookingsList';
import ChatbotWidget from '@/components/homepage/ChatbotWidget';

export default function BookingsPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-1 py-16">
        <BookingsList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
