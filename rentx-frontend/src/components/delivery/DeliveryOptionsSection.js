// DeliveryOptionsSection.js
// Main content for the Delivery Options page

export default function DeliveryOptionsSection() {
  return (
    <section className="py-16 bg-[#F8F1E9]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center">Delivery Options</h2>
        <div className="bg-white rounded-lg shadow p-8">
          <ul className="space-y-6">
            <li>
              <h3 className="text-xl font-semibold mb-1">Self Pickup</h3>
              <p className="text-gray-600">Pick up your item directly from the owner&apos;s location at a scheduled time. No extra charges apply.</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold mb-1">Home Delivery</h3>
              <p className="text-gray-600">Get your item delivered to your doorstep for a small delivery fee. Available in select locations.</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold mb-1">Courier Service</h3>
              <p className="text-gray-600">For long-distance rentals, we offer trusted courier partners to deliver and return your item safely.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
