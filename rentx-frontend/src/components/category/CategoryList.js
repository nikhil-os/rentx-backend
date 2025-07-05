import Link from 'next/link';
import Image from "next/image";

export default function CategoryList() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">All Categories</h2>
          <p className="text-gray-500">Browse through all available rental categories</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/accessories" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://media.istockphoto.com/id/2161307186/photo/equipment-of-modern-photographer-on-a-yellow-background-top-view-flat-lay.webp?a=1&b=1&s=612x612&w=0&k=20&c=74vTlfOc48IGHvWKB0MZRtwP5sc4TmWyrBv52jqtAZM=" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Accessories</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          <Link href="/decor" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1565038941323-e5ceac0fcde2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRlY29yfGVufDB8fDB8fHww" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Decor</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          <Link href="/electronics" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1589451825788-d81b78a48a33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcCUyQyUyMGNhbWVyYSUyMGFuZCUyMG90aGVyJTIwZGV2aWNlcyUyMHdhbGxhcGFwZXJ8ZW58MHx8MHx8fDA%3D" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Electronics</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          <Link href="/vehicles" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Vehicles" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Vehicles</h5>
              <p className="text-gray-500 text-sm mb-2">Cars, bikes, scooters and more</p>
            </div>
          </Link>
          <Link href="/furniture" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Furniture" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Furniture</h5>
              <p className="text-gray-500 text-sm mb-2">Chairs, tables, sofas and more</p>
            </div>
          </Link>
          <Link href="/sports" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1683115098516-9b8d5c643b5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dG9vbHMlMjBhbmQlMjBlcXVpcG1lbnRzfGVufDB8fDB8fHww" alt="Tools" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Tools & Equipment</h5>
              <p className="text-gray-500 text-sm mb-2">Power tools, gardening equipment and more</p>
            </div>
          </Link>
          <Link href="/fashion" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGZhc2hpb258ZW58MHx8MHx8fDA%3D" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Fashion</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          <Link href="/female" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1632266093786-f0598ebf7878?w=600&auto=format&fit=crop&w=1350&q=80" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Female</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          <Link href="/kids" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1632163570616-8699e344f486?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGtpZHMlMjBUcmFtcG9saW5lc3xlbnwwfHwwfHx8MA%3D%3D" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Kids</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          <Link href="/male" className="no-underline">
            <div className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full">
              <Image src="https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hbGUlMjB3ZWRkaW5nJTIwY2xvdGhlcyUyMGNvbGxlY3Rpb258ZW58MHx8MHx8fDA%3D" alt="Electronics" width={400} height={160} className="rounded mb-3 object-cover h-40 w-full" />
              <h5 className="font-bold text-lg mb-1">Male</h5>
              <p className="text-gray-500 text-sm mb-2">Laptops, cameras, VR headsets and more</p>
            </div>
          </Link>
          
          
        </div>
      </div>
    </section>
  );
}
