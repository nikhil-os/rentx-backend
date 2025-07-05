// male/page.js
// Male Fashion page route for /male

import MaleFashionList from "@/components/male/MaleFashionList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function MaleFashionPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <MaleFashionList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
