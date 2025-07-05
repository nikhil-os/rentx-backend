// AboutSection.js
// Main content for the About page

export default function AboutSection() {
  return (
    <section className="py-16 bg-[#F8F1E9]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-center">About RentX</h2>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 mb-4">RentX is India&apos;s most trusted rental platform, connecting people who need items with those who have them to rent. Our mission is to make renting easy, affordable, and accessible for everyone.</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Wide range of categories: electronics, vehicles, furniture, fashion, and more.</li>
            <li>Secure payments and verified listings for peace of mind.</li>
            <li>Flexible delivery and pickup options to suit your needs.</li>
            <li>Community-driven with reviews and ratings for trust and transparency.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
