// CategoryTemplate.js
// Reusable template for all category pages with enhanced design
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CategoryTemplate({ 
  title, 
  description, 
  items, 
  loading, 
  error,
  categoryImage = "/ref1.png" // Default hero image
}) {
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block mx-auto">
        <h3 className="text-red-600 font-medium text-lg mb-2">Error Loading Items</h3>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  // Sort items based on selected option
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "name-asc":
        return (a.name || a.title || "").localeCompare(b.name || b.title || "");
      case "name-desc":
        return (b.name || b.title || "").localeCompare(a.name || a.title || "");
      default:
        return 0;
    }
  });

  return (
    <section className="bg-[#F8F1E9]">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={categoryImage}
          alt={title}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4 text-center drop-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center drop-shadow-md">
            {description}
          </p>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center">
              <h3 className="font-medium mr-4">Found {items.length} items</h3>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid or List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col h-full">
                <div className="relative">
                  <Image
                    src={item.image && !item.image.startsWith('http') ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}` : (item.image || item.img || '/ref1.png')}
                    alt={item.name || item.title}
                    width={400}
                    height={200}
                    className="rounded-md mb-3 object-cover h-52 w-full"
                  />
                  {item.tag && (
                    <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">{item.tag}</span>
                  )}
                </div>
                <h5 className="font-bold text-lg mb-1">{item.name || item.title}</h5>
                <p className="text-gray-500 text-sm mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location}
                </p>
                <div className="flex items-baseline mb-3">
                  <h5 className="text-emerald-800 font-semibold text-lg">₹{item.price}</h5>
                  <span className="text-gray-400 text-sm ml-1">/ day</span>
                </div>
                <div className="flex flex-wrap mb-2 gap-2">
                  {item.authenticity && <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">Authenticity: {item.authenticity}</span>}
                  {item.safety && <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">Safety: {item.safety}</span>}
                </div>
                <div className="flex justify-between border-t pt-3 mt-auto text-xs text-gray-500">
                  {item.minDays && (
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Min. {item.minDays} days
                    </span>
                  )}
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {item.rating || 4.5} ({item.reviews || 0})
                  </span>
                </div>
                <Link 
                  href={`/booking?rentalId=${item._id}`}
                  className="mt-4 block text-center bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-md font-medium tracking-wide transition-colors"
                >
                  Rent Now
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedItems.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4 relative">
                    <Image
                      src={item.image && !item.image.startsWith('http') ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}` : (item.image || item.img || '/ref1.png')}
                      alt={item.name || item.title}
                      width={300}
                      height={200}
                      className="rounded-md object-cover h-52 w-full"
                    />
                    {item.tag && (
                      <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">{item.tag}</span>
                    )}
                  </div>
                  <div className="md:w-3/4 flex flex-col">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h5 className="font-bold text-xl mb-1">{item.name || item.title}</h5>
                        <p className="text-gray-500 text-sm mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.location}
                        </p>
                      </div>
                      <div className="flex items-baseline mb-3">
                        <h5 className="text-emerald-800 font-semibold text-xl">₹{item.price}</h5>
                        <span className="text-gray-400 text-sm ml-1">/ day</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap mb-2 gap-2">
                      {item.authenticity && <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">Authenticity: {item.authenticity}</span>}
                      {item.safety && <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">Safety: {item.safety}</span>}
                    </div>
                    
                    <div className="flex justify-between border-t pt-3 mt-auto text-xs text-gray-500">
                      <div>
                        {item.minDays && (
                          <span className="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Min. {item.minDays} days
                          </span>
                        )}
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          {item.rating || 4.5} ({item.reviews || 0})
                        </span>
                      </div>
                      <Link 
                        href={`/booking?rentalId=${item._id}`}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-1 rounded-md font-medium tracking-wide transition-colors"
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 inline-block mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-gray-700 font-medium text-lg mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">We couldn&apos;t find any {title.toLowerCase()} items available for rent.</p>
              <Link href="/add-product" className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-md font-medium">
                Add a Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}