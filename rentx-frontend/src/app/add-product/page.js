// add-product/page.js
// Add Product page route for /add-product

import AddProductForm from "@/components/addproduct/AddProductForm";
import ChatbotWidget from "@/components/homepage/ChatbotWidget";

export default function AddProductPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-1 py-16">
        <AddProductForm />
      </div>
      <ChatbotWidget />
    </main>
  );
}
