// decor/page.js
// Decor page route for /decor

import DecorList from "@/components/decor/DecorList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function DecorPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <DecorList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
