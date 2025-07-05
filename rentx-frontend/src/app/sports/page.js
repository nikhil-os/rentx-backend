// sports/page.js
// Sports page route for /sports

import SportsList from "@/components/sports/SportsList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function SportsPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <SportsList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
