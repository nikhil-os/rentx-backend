// login/page.js
// Login page route for /login

import LoginForm from "@/components/login/LoginForm";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function LoginPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-1 py-16">
        <LoginForm />
      </div>
      <ChatbotWidget />
    </main>
  );
}
