// products/page.js
// Products page route for /products

import ProductsList from "@/components/products/ProductsList";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function ProductsPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        <ProductsList />
      </div>
      <ChatbotWidget />
    </main>
  );
}
