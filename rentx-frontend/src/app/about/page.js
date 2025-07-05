// about/page.js
// About page route for /about

import AboutSection from "@/components/about/AboutSection";
// import ChatbotWidget from "@components/homepage/ChatbotWidget";

export default function AboutPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <AboutSection />
      </div>
      {/* <ChatbotWidget /> */}
    </main>
  );
}
