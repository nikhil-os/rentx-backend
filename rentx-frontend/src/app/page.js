'use client';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';
import HeroSection from "../components/homepage/HeroSection";
import AICategories from "../components/homepage/AICategories";
import PopularCategories from "../components/homepage/PopularCategories";
import FeaturedItems from "../components/homepage/FeaturedItems";
import HowItWorks from "../components/homepage/HowItWorks";
import CallToAction from "../components/homepage/CallToAction";
import ChatbotWidget from "../components/homepage/ChatbotWidget";

export default function Home() {
  // Chatbot state
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
    <main className="bg-[#F8F1E9] text-[#1A1A1A] font-poppins">
      <HeroSection />
      <AICategories />
      <PopularCategories />
      <FeaturedItems />
      <HowItWorks />
      <CallToAction />
      <ChatbotWidget />
    </main>
  );
}
