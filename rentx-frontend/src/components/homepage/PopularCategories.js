import Image from "next/image";
import Link from "next/link";

export default function PopularCategories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Popular Categories</h2>
          <p className="text-gray-500">Browse through our most popular rental categories to find what you need</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/electronics" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Electronics</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>250+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.8/5</span>
              </div>
            </div>
          </Link>
          <Link href="/vehicles" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Vehicles" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Vehicles</h5>
              <p className="text-gray-500 text-sm mb-2">Cars, bikes, scooters and more</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>180+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.7/5</span>
              </div>
            </div>
          </Link>
          <Link href="/furniture" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Furniture" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Furniture</h5>
              <p className="text-gray-500 text-sm mb-2">Chairs, tables, sofas and more</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>320+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.9/5</span>
              </div>
            </div>
          </Link>
          <Link href="/sports" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Tools" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Tools & Equipment</h5>
              <p className="text-gray-500 text-sm mb-2">Power tools, gardening equipment and more</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                <span><i className="fas fa-boxes mr-1"></i>410+ items</span>
                <span><i className="fas fa-star mr-1"></i>4.8/5</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
