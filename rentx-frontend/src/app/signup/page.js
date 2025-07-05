// Signup page route for /signup
import SignupForm from "@/components/signup/SignupForm";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function SignupPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-1 py-16">
        <SignupForm />
      </div>
      <ChatbotWidget />
    </main>
  );
}
