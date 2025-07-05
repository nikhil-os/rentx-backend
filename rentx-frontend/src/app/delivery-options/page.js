// delivery-options/page.js
// Delivery Options page route for /delivery-options

import DeliveryOptionsSection from "@/components/delivery/DeliveryOptionsSection";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function DeliveryOptionsPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <DeliveryOptionsSection />
      </div>
      <ChatbotWidget />
    </main>
  );
}
