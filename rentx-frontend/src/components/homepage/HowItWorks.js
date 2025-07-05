export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">How RentX Works</h2>
          <p className="text-gray-500">Renting has never been easier. Just follow these simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-[#1B3C34] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">1</div>
            <h4 className="font-bold mb-2">Browse & Select</h4>
            <p className="text-gray-500">Find the perfect item from our wide selection of categories</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-[#1B3C34] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">2</div>
            <h4 className="font-bold mb-2">Book & Pay</h4>
            <p className="text-gray-500">Select your dates and make a secure payment online</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-[#1B3C34] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">3</div>
            <h4 className="font-bold mb-2">Receive Item</h4>
            <p className="text-gray-500">Get the item delivered or pick it up from the owner</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-[#1B3C34] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">4</div>
            <h4 className="font-bold mb-2">Return & Review</h4>
            <p className="text-gray-500">Return the item after use and leave a review</p>
          </div>
        </div>
      </div>
    </section>
  );
}
