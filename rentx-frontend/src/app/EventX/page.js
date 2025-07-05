// EventX page route for /EventX
import EventXSection from "@/components/eventx/EventXSection";
// import ChatbotWidget from "@components/homepage/ChatbotWidget";

export default function EventXPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <EventXSection />
      </div>
      {/* <ChatbotWidget /> */}
    </main>
  );
}
