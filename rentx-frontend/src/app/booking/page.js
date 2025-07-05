export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import BookingSectionClient from '@/components/booking/BookingSectionClient';
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function BookingPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <Suspense fallback={<div>Loading booking...</div>}>
        <BookingSectionClient />
      </Suspense>
      <ChatbotWidget />
    </main>
  );
}
