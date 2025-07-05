// ProductsList.js
// Main content for the Products page

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Link from "next/link";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setProducts(data);
      } catch (err) {
        setError(
          typeof err === "string"
            ? err
            : err.message || "Failed to load products."
        );
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center py-10">Loading products...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <section className="py-16 bg-[#F8F1E9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">
            All Products
          </h2>
          <p className="text-gray-500">Browse all items available for rent</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item, idx) => (
            <div
              key={item._id || idx}
              className="bg-white rounded-lg shadow hover:-translate-y-1 transition p-4 flex flex-col h-full"
            >
              <div className="relative">
                <Image
                  src={item.image || item.img || "/ref1.png"}
                  alt={item.name}
                  width={400}
                  height={200}
                  className="rounded mb-3 object-cover h-52 w-full"
                />
                {item.tag && (
                  <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>
              <h5 className="font-bold text-lg mb-1">{item.name}</h5>
              <p className="text-gray-500 text-sm mb-2">
                <i className="fas fa-map-marker-alt mr-1"></i> {item.location}
              </p>
              <h5 className="text-[#1B3C34] mb-3">
                ₹{item.price}{" "}
                <span className="text-gray-400 text-sm">/ day</span>
              </h5>
              <div className="flex flex-wrap mb-2 gap-2">
                {item.authenticity && (
                  <span className="bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">
                    Authenticity: {item.authenticity}
                  </span>
                )}
                {item.safety && (
                  <span className="bg-[#1B3C34] text-white text-xs px-3 py-1 rounded-full">
                    Safety: {item.safety}
                  </span>
                )}
              </div>
              <div className="flex justify-between border-t pt-3 text-xs text-gray-400">
                {item.minDays && (
                  <span>
                    <i className="fas fa-calendar-alt mr-1"></i>Min.{" "}
                    {item.minDays} days
                  </span>
                )}
                {item.rating && (
                  <span>
                    <i className="fas fa-star mr-1"></i>
                    {item.rating} ({item.reviews})
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Link
                  href={`/booking?rentalId=${item._id}`}
                  className="text-[#1B3C34] underline"
                >
                  Rent
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
