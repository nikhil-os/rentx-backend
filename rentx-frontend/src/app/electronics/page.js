// electronics/page.js
// Electronics page route for /electronics

import ElectronicsList from "@/components/electronics/ElectronicsList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function ElectronicsPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <ElectronicsList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
