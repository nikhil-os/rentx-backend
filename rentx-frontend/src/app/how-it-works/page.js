// how-it-works/page.js
// How It Works page route for /how-it-works

import HowItWorksSection from "@/components/howitworks/HowItWorksSection";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function HowItWorksPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <HowItWorksSection />
      </div>
      <ChatbotWidget />
    </main>
  );
}
