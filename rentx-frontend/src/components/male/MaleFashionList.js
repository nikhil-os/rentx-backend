// MaleFashionList.js
// Main content for the Male Fashion page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function MaleFashionList() {
  const [maleItems, setMaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMale() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setMaleItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "male"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load male fashion items."));
      }
      setLoading(false);
    }
    fetchMale();
  }, []);

  return (
    <CategoryTemplate
      title="Men's Fashion"
      description="Explore stylish and modern men's fashion for any occasion"
      items={maleItems}
      loading={loading}
      error={error}
      categoryImage="/male-fashion-hero.jpg"
    />
  );
}
