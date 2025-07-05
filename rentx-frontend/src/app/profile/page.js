// Profile page route for /profile
import ProfileSection from "@/components/profile/ProfileSection";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function ProfilePage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <ProfileSection />
      </div>
      <ChatbotWidget />
    </main>
  );
} 