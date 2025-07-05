// fashion/page.js
// Fashion page route for /fashion

import FashionList from "@/components/fashion/FashionList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function FashionPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <FashionList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
