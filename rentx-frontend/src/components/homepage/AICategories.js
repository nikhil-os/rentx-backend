import Image from "next/image";

export default function AICategories() {
  return (
    <section className="py-16 bg-[#E5E7EB]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Explore Categories for You</h2>
          <p className="text-gray-500" title="Curated by AI for you!">Curated rental categories based on your preferences and location, powered by AI.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="#" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGZhc2hpb258ZW58MHx8MHx8fDA%3D" alt="Fashion" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Fashion</h5>
              <p className="text-gray-500 text-sm mb-2">Lehengas, sherwanis, and more for your events</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>150+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.9/5</span>
              </div>
            </div>
          </a>
          <a href="#" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Event Supplies" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Event & Party Supplies</h5>
              <p className="text-gray-500 text-sm mb-2">Decorations, lighting, and banquet halls</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>200+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.8/5</span>
              </div>
            </div>
          </a>
          <a href="#" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Real Estate" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Real Estate</h5>
              <p className="text-gray-500 text-sm mb-2">Apartments, offices, and event venues</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>100+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.7/5</span>
              </div>
            </div>
          </a>
          <a href="#" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1589451825788-d81b78a48a33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcCUyQyUyMGNhbWVyYSUyMGFuZCUyMG90aGVyJTIwZGV2aWNlcyUyMHdhbGxhcGFwZXJ8ZW58MHx8MHx8fDA%3D" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Electronics</h5>
              <p className="text-gray-500 text-sm mb-2">Cameras, laptops, and gadgets</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>250+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.8/5</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
