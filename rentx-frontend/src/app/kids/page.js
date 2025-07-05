// kids/page.js
// Kids page route for /kids

import KidsList from "@/components/kids/KidsList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function KidsPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <KidsList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
