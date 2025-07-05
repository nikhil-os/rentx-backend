"use client";
import { useState, useRef } from "react";

export default function ChatbotWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! Welcome to RentX. How can I assist you today?' }
  ]);
  const chatInputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Handle sending a message
  const sendMessage = (message) => {
    setChatMessages((msgs) => [...msgs, { type: 'user', text: message }]);
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { type: 'bot', text: getBotResponse(message) }
      ]);
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 500);
  };

  // Simple bot response logic
  function getBotResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('rent')) {
      return 'Looking to rent something? Browse our categories like Electronics, Vehicles, or Fashion on the homepage!';
    } else if (lower.includes('help')) {
      return 'I’m here to assist! You can ask about renting items, listing your own, or navigating RentX.';
    } else if (lower.includes('category') || lower.includes('categories')) {
      return 'We have a variety of categories including Electronics, Vehicles, Furniture, Fashion, and more. Check them out in the "Explore Categories" section!';
    } else {
      return 'Sorry, I didn’t quite catch that. Could you clarify or ask about renting, categories, or listing items?';
    }
  }

  // Handle Enter key in chat input
  const handleChatInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      sendMessage(e.target.value.trim());
      e.target.value = '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <button onClick={() => setChatOpen((v) => !v)} className="bg-[#D4A017] text-[#1A1A1A] rounded-full p-4 text-xl shadow-lg animate-pulse"><i className="fas fa-robot"></i></button>
      {chatOpen && (
        <div className="w-80 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-[#1B3C34] text-white text-center py-2 font-playfair rounded-t-lg">RentX AI Assistant</div>
          <div ref={chatBodyRef} className="flex-1 p-3 overflow-y-auto h-72 bg-[#E5E7EB]">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`mb-2 px-3 py-2 rounded-lg text-sm ${msg.type === 'user' ? 'bg-[#D4A017] text-[#1A1A1A] self-end text-right ml-16' : 'bg-white text-[#1A1A1A] self-start mr-16'}`}>{msg.text}</div>
            ))}
          </div>
          <div className="border-t border-gray-300 p-2 bg-white">
            <input ref={chatInputRef} type="text" className="w-full rounded-full px-3 py-2 bg-[#E5E7EB] focus:bg-white outline-none" placeholder="Type your message..." onKeyDown={handleChatInput} />
          </div>
        </div>
      )}
    </div>
  );
}
