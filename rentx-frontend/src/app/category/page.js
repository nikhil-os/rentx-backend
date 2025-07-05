import CategoryHero from "../../components/category/CategoryHero";
import CategoryList from "../../components/category/CategoryList";
import ChatbotWidget from "../../components/homepage/ChatbotWidget";

export default function CategoryPage() {
  return (
    <main className="bg-[#F8F1E9] text-[#1A1A1A] font-poppins">
      <CategoryHero />
      <CategoryList />
      <ChatbotWidget />
    </main>
  );
}
