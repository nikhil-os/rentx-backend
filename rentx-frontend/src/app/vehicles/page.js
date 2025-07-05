// vehicles/page.js
// Vehicles page route for /vehicles

import VehiclesList from "@/components/vehicles/VehiclesList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function VehiclesPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <VehiclesList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
