// BookingSectionClient.js
'use client';
import { useSearchParams } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';
import ChatbotWidget from '@/components/homepage/ChatbotWidget';

export default function BookingSectionClient() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get('rentalId');
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-1 py-16">
        <BookingForm rentalId={rentalId} />
      </div>
      <ChatbotWidget />
    </main>
  );
}
