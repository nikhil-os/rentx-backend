// EventXSection.js
// Main content for the EventX page

export default function EventXSection() {
  return (
    <section className="py-16 bg-[#F8F1E9]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center">EventX Rentals</h2>
        <div className="bg-white rounded-lg shadow p-8">
          <ul className="space-y-6">
            <li>
              <h3 className="text-xl font-semibold mb-1">Event Furniture</h3>
              <p className="text-gray-600">Chairs, tables, and decor for all types of events and gatherings.</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold mb-1">Audio/Visual Equipment</h3>
              <p className="text-gray-600">Projectors, speakers, and lighting for presentations and parties.</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold mb-1">Party Supplies</h3>
              <p className="text-gray-600">Tents, canopies, and more for outdoor and indoor celebrations.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
