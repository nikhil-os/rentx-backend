import Image from "next/image";

export default function FeaturedItems() {
  return (
    <section className="py-16 bg-[#F8F1E9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Featured Items</h2>
          <p className="text-gray-500">Check out these popular items available for rent near you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MacBook Pro */}
          <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="MacBook Pro" width={400} height={200} className="rounded mb-3 object-cover h-52 w-full" />
              <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">Popular</span>
            </div>
            <h5 className="font-bold text-lg mb-1">MacBook Pro 2023</h5>
            <p className="text-gray-500 text-sm mb-2"><i className="fas fa-map-marker-alt mr-1"></i> Bangalore, Karnataka</p>
            <h5 className="text-[#1B3C34] mb-3">₹999 <span className="text-gray-400 text-sm">/ day</span></h5>
            <div className="flex flex-wrap mb-2 gap-2">
              <span className="bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">Authenticity: 94%</span>
              <span className="bg-[#1B3C34] text-white text-xs px-3 py-1 rounded-full">Safety: High</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-xs text-gray-400">
              <span><i className="fas fa-calendar-alt mr-1"></i>Min. 3 days</span>
              <span><i className="fas fa-star mr-1"></i>4.9 (24)</span>
            </div>
            <div className="flex justify-center">
              <span className="mt-4 bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full text-lg font-bold text-center">
                Coming Soon
              </span>
            </div>
          </div>
          {/* Canon EOS R5 */}
          <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1494972308805-463bc619d34e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Canon EOS R5" width={400} height={200} className="rounded mb-3 object-cover h-52 w-full" />
              <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">New</span>
            </div>
            <h5 className="font-bold text-lg mb-1">Canon EOS R5</h5>
            <p className="text-gray-500 text-sm mb-2"><i className="fas fa-map-marker-alt mr-1"></i> Mumbai, Maharashtra</p>
            <h5 className="text-[#1B3C34] mb-3">₹1,499 <span className="text-gray-400 text-sm">/ day</span></h5>
            <div className="flex flex-wrap mb-2 gap-2">
              <span className="bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">Authenticity: 96%</span>
              <span className="bg-[#1B3C34] text-white text-xs px-3 py-1 rounded-full">Safety: Medium</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-xs text-gray-400">
              <span><i className="fas fa-calendar-alt mr-1"></i>Min. 2 days</span>
              <span><i className="fas fa-star mr-1"></i>4.8 (16)</span>
            </div>
            <div className="flex justify-center">
              <span className="mt-4 bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full text-lg font-bold text-center">
                Coming Soon
              </span>
            </div>
          </div>
          {/* Hyundai Creta 2022 */}
          <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Hyundai Creta" width={400} height={200} className="rounded mb-3 object-cover h-52 w-full" />
              <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">Popular</span>
            </div>
            <h5 className="font-bold text-lg mb-1">Hyundai Creta 2022</h5>
            <p className="text-gray-500 text-sm mb-2"><i className="fas fa-map-marker-alt mr-1"></i> Delhi</p>
            <h5 className="text-[#1B3C34] mb-3">₹2,499 <span className="text-gray-400 text-sm">/ day</span></h5>
            <div className="flex flex-wrap mb-2 gap-2">
              <span className="bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">Authenticity: 93%</span>
              <span className="bg-[#1B3C34] text-white text-xs px-3 py-1 rounded-full">Safety: High</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-xs text-gray-400">
              <span><i className="fas fa-calendar-alt mr-1"></i>Min. 7 days</span>
              <span><i className="fas fa-star mr-1"></i>4.7 (32)</span>
            </div>
            <div className="flex justify-center">
              <span className="mt-4 bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full text-lg font-bold text-center">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
