// HowItWorksSection.js
// Main content for the How It Works page

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-[#F8F1E9]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center">How It Works</h2>
        <ol className="space-y-8">
          <li className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
            <span className="text-4xl text-[#D4A017] font-bold">1</span>
            <div>
              <h3 className="text-xl font-semibold mb-2">Browse or Search</h3>
              <p className="text-gray-600">Explore categories or use search to find the item you want to rent. Filter by location, price, or type for best results.</p>
            </div>
          </li>
          <li className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
            <span className="text-4xl text-[#D4A017] font-bold">2</span>
            <div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay Securely</h3>
              <p className="text-gray-600">Select your rental dates, review details, and pay securely online. Your payment is held safely until the rental begins.</p>
            </div>
          </li>
          <li className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
            <span className="text-4xl text-[#D4A017] font-bold">3</span>
            <div>
              <h3 className="text-xl font-semibold mb-2">Pickup or Delivery</h3>
              <p className="text-gray-600">Coordinate with the owner for pickup or choose delivery options. Inspect the item and enjoy your rental period.</p>
            </div>
          </li>
          <li className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
            <span className="text-4xl text-[#D4A017] font-bold">4</span>
            <div>
              <h3 className="text-xl font-semibold mb-2">Return & Review</h3>
              <p className="text-gray-600">Return the item as agreed. Leave a review to help others and build trust in the community.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
