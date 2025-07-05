// FashionList.js
// Main content for the Fashion page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function FashionList() {
  const [fashionItems, setFashionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFashion() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setFashionItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "fashion"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load fashion items."));
      }
      setLoading(false);
    }
    fetchFashion();
  }, []);

  return (
    <CategoryTemplate
      title="Fashion"
      description="Discover trendy fashion items available for rent"
      items={fashionItems}
      loading={loading}
      error={error}
      categoryImage="/fashion-hero.jpg"
    />
  );
}
