// accessories/page.js
// Accessories page route for /accessories

import AccessoriesList from "@/components/accessories/AccessoriesList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function AccessoriesPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <AccessoriesList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
